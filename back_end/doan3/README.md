# doan3 Backend

Backend Node.js/Express cho hệ thống thương mại điện tử, sử dụng MySQL và JWT. Dự án tổ chức theo mô hình `routes -> controllers -> services -> database`, trong đó phần lớn nghiệp vụ được đẩy xuống stored procedure trong MySQL.

## Tổng quan

- Runtime: Node.js
- Framework: Express 4
- Database: MySQL qua `mysql2`
- Auth: JWT Bearer token
- Cấu hình môi trường: `dotenv`
- Chạy dev: `nodemon`

## Cấu trúc thư mục

```text
src/
  config/
    db.js
  controllers/
  middlewares/
    authMiddleware.js
  routes/
  services/
  index.js
package.json
.env
```

## Kiến trúc

Luồng xử lý chính:

1. `routes` khai báo endpoint.
2. `controllers` validate input, map HTTP status/message.
3. `services` gọi MySQL, chủ yếu thông qua stored procedure.
4. `config/db.js` tạo connection pool dùng chung.

Các route đang được mount trong [src/index.js](/Applications/backend/doan3/back_end/doan3/src/index.js:1):

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET|POST|PUT|PATCH|DELETE /api/users`
- `GET|POST|DELETE /api/categories`
- `GET|POST|PUT|DELETE /api/products`
- `POST|GET|PUT|DELETE /api/cart-items`
- `POST /api/cart`
- `GET|POST|PUT|PATCH /api/orders`
- `POST /api/order-items`
- `GET|POST /api/reviews`
- `GET /api/dashboard/*`
- `GET|POST|PUT|DELETE|PATCH /api/headers`

Ngoại trừ `/api/auth/*`, toàn bộ route còn lại yêu cầu header:

```http
Authorization: Bearer <access_token>
```

## Cài đặt và chạy

### 1. Cài dependency

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo hoặc cập nhật file `.env` với các biến:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=7d
PORT=3000
```

Lưu ý:

- Không commit secret thật vào repository.
- Hiện repo đang dùng trực tiếp `.env`; chưa có `.env.example`.

### 3. Chuẩn bị database

Code hiện tại phụ thuộc vào bảng và stored procedure trong MySQL. Tên procedure được gọi trực tiếp trong `src/services/*.js`, ví dụ:

- `sp_register_user`
- `sp_get_user_by_email`
- `sp_create_category`
- `sp_create_product`
- `sp_add_product_image`
- `sp_checkout_order`
- `sp_dashboard_summary`
- `sp_add_header`
- `sp_get_all_headers`
- `sp_get_header_by_id`
- `sp_update_header`
- `sp_delete_header`
- `sp_activate_header`

Nếu thiếu schema hoặc procedure tương ứng, API sẽ lỗi ở tầng service.

### 4. Chạy server

Development:

```bash
npm run dev
```

Production/local run:

```bash
npm start
```

Server mặc định chạy tại:

```text
http://localhost:3000
```

Health check đơn giản:

```http
GET /
```

## Các module nghiệp vụ

### 1. Authentication

- `POST /api/auth/register`: đăng ký user mới với role mặc định là `user`
- `POST /api/auth/login`: trả về thông tin user và `accessToken`

Ghi chú:

- Password hiện được so sánh trực tiếp trong [src/services/authService.js](/Applications/backend/doan3/back_end/doan3/src/services/authService.js:1), chưa thấy hash ở tầng Node.js.

### 2. User

- Tạo user
- Lấy danh sách user
- Bật/tắt trạng thái user
- Cập nhật user theo email

### 3. Category

- Tạo danh mục
- Lấy danh sách danh mục
- Xóa danh mục

Service có xử lý trường hợp danh mục đang chứa sản phẩm.

### 4. Product

- Tạo sản phẩm
- Lấy danh sách sản phẩm
- Lấy chi tiết sản phẩm
- Cập nhật sản phẩm
- Xóa sản phẩm
- Tìm kiếm theo `keyword` và `category_id`
- Thêm một hoặc nhiều ảnh

Ghi chú:

- `createProduct` dùng transaction.
- `getProductById` có normalize trường `images` từ JSON/string/buffer về mảng JS.

### 5. Cart và Cart Item

- Tạo giỏ hàng
- Thêm sản phẩm vào giỏ
- Lấy giỏ hàng theo user
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ

### 6. Order và Order Item

- Tạo đơn hàng thủ công
- Checkout từ giỏ hàng
- Lấy danh sách đơn hàng
- Lấy đơn theo user và trạng thái
- Lấy chi tiết đơn
- Hủy đơn
- Cập nhật trạng thái đơn
- Thêm order item

### 7. Review

- Tạo đánh giá sản phẩm
- Lấy đánh giá theo sản phẩm

### 8. Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/top-products`

### 9. Header

- Tạo header
- Lấy danh sách header
- Lấy chi tiết header
- Cập nhật header
- Xóa header
- Kích hoạt header đang dùng

Field chính:

- `site_name`
- `logo_url`
- `hotline`
- `email`
- `address`
- `banner_text`
- `banner_image_url`
- `is_active`

Thủ tục SQL mẫu đã được thêm tại [sql/header_procedures.sql](/Applications/backend/doan3/back_end/doan3/sql/header_procedures.sql:1).

## Middleware và xử lý lỗi

[src/middlewares/authMiddleware.js](/Applications/backend/doan3/back_end/doan3/src/middlewares/authMiddleware.js:1):

- đọc `Authorization`
- verify JWT bằng `JWT_SECRET`
- gắn payload vào `req.user`

[src/index.js](/Applications/backend/doan3/back_end/doan3/src/index.js:1) có global error handler để:

- trả `400` khi JSON body lỗi cú pháp
- trả `500` cho lỗi chưa xử lý

## Scripts npm

```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

## Hạn chế hiện có

- Chưa có test tự động.
- Chưa có tài liệu OpenAPI/Swagger.
- Chưa có `.env.example`.
- Phần lớn nghiệp vụ phụ thuộc mạnh vào stored procedure, nên việc chạy độc lập cần đủ SQL schema.
- Password hiện chưa được hash ở tầng source Node.js.

## Gợi ý cải thiện

- Bổ sung `README` cho database/schema và file seed.
- Thêm `dotenv.example`.
- Bổ sung test cho controller/service.
- Chuẩn hóa response schema giữa các module.
- Hash password bằng `bcrypt`.
