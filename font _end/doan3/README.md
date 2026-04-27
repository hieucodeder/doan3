# DoAn3 Frontend

Frontend React + Vite cho hệ thống bán nước hoa `NGỌC ÁNH Perfumes`. Ứng dụng có 2 luồng chính:

- `customer`: xem sản phẩm, tìm kiếm, xem chi tiết, thêm giỏ hàng, checkout, theo dõi đơn hàng, đánh giá sản phẩm.
- `admin`: xem dashboard, quản lý sản phẩm, đơn hàng, người dùng, danh mục, trang tĩnh, header và menu.

Ứng dụng không dùng `react-router`; toàn bộ điều hướng được điều khiển bằng state trong [`src/App.jsx`](/Applications/backend/doan3/font%20_end/doan3/src/App.jsx) và [`src/pages/PortalUI.jsx`](/Applications/backend/doan3/font%20_end/doan3/src/pages/PortalUI.jsx).

## Công nghệ sử dụng

- React 19
- Vite 8
- ESLint 9
- Fetch API thuần qua [`src/services/apiClient.js`](/Applications/backend/doan3/font%20_end/doan3/src/services/apiClient.js)
- Lưu đăng nhập bằng `localStorage`

## Cấu trúc thư mục

```text
src/
  components/         Top navigation, footer, bảng hiển thị
  data/               Helpers dùng chung, hiện có format giá
  pages/
    admin/            Các màn CRUD/admin dashboard
    customer/         Trang storefront, giỏ hàng, checkout, đơn hàng
    Login.jsx         Đăng nhập
    Register.jsx      Đăng ký
    PortalUI.jsx      Điều phối giao diện theo role
  services/
    apiClient.js      Base URL, auth token, helper gọi API
public/               Tài nguyên tĩnh
```

## Chức năng hiện có

### 1. Xác thực

- Đăng nhập qua `POST /api/auth/login`
- Đăng ký qua `POST /api/auth/register`
- Lưu `accessToken` và `currentUser` trong `localStorage`
- Có kiểm tra trạng thái tài khoản bị vô hiệu hóa bằng `POST /api/users/check-status`

### 2. Khu vực khách hàng

- Tải danh mục từ `GET /api/categories`
- Tải sản phẩm từ `GET /api/products`
- Tìm kiếm sản phẩm bằng `GET /api/products/search`
- Xem chi tiết sản phẩm và gallery ảnh từ `GET /api/products/:id`
- Hiển thị review trung bình từ `GET /api/reviews/:productId`
- Gửi review bằng `POST /api/reviews`
- Quản lý giỏ hàng:
  - `GET /api/cart-items/:userId`
  - `POST /api/cart-items`
  - `PUT /api/cart-items`
  - `DELETE /api/cart-items`
- Checkout bằng `POST /api/orders/checkout`
- Xem lịch sử đơn hàng:
  - `GET /api/orders/user/:userId`
  - `GET /api/orders/user/:userId?status=...`
  - `GET /api/orders/history/:orderId`
  - `PATCH /api/orders/:orderId/cancel`
- Header/menu động cho storefront:
  - `GET /api/headers`
  - `GET /api/headers/:headerId/menus`

### 3. Khu vực quản trị

- Dashboard:
  - `GET /api/dashboard/summary`
  - `GET /api/dashboard/top-products`
- Sản phẩm:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- Đơn hàng:
  - `GET /api/orders`
  - `GET /api/orders/:id/detail`
  - `PUT /api/orders/:id/status`
  - `PATCH /api/orders/:id/cancel`
- Người dùng:
  - `GET /api/users`
  - `PATCH /api/users/:id/status`
  - `PUT /api/users/email`
- Danh mục:
  - `GET /api/categories`
  - `POST /api/categories`
  - `DELETE /api/categories/:id`
- Trang tĩnh:
  - `GET /api/static-pages`
  - `POST /api/static-pages`
  - `PUT /api/static-pages/:id`
  - `DELETE /api/static-pages/:id`
- Header/menu:
  - `GET /api/headers`
  - `POST /api/headers`
  - `PUT /api/headers/:id`
  - `DELETE /api/headers/:id`
  - `PUT /api/headers/:id/activate`
  - `GET /api/headers/:headerId/menus`
  - `POST /api/headers/:headerId/menus`
  - `PUT /api/headers/menus/:menuId`
  - `DELETE /api/headers/menus/:menuId`
  - `PUT /api/headers/menus/:menuId/toggle`

## Cài đặt và chạy

### Yêu cầu

- Node.js 18+
- Backend API chạy sẵn ở cổng phù hợp

### Cài dependency

```bash
npm install
```

### Biến môi trường

Tạo file `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Nếu không khai báo, app cũng mặc định dùng `http://localhost:3000`.

### Chạy môi trường phát triển

```bash
npm run dev
```

Mặc định Vite sẽ chạy tại `http://localhost:5173`.

### Build production

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

### Kiểm tra lint

```bash
npm run lint
```

## Luồng hoạt động chính

### Customer

1. Người dùng đăng nhập hoặc đăng ký.
2. App lưu token và thông tin user trong `localStorage`.
3. `PortalUI` đọc role để hiển thị giao diện customer.
4. Trang chủ tải danh mục, sản phẩm, menu động.
5. Người dùng thêm sản phẩm vào giỏ, thanh toán, rồi theo dõi đơn hàng trong tab `My Orders`.

### Admin

1. Đăng nhập bằng tài khoản có `role === 'admin'`.
2. `PortalUI` chuyển sang bộ tab quản trị.
3. Admin thao tác CRUD trực tiếp qua các endpoint backend.

## Một số ghi chú kỹ thuật

- App điều hướng bằng state, không có URL routing.
- `apiClient.js` luôn gửi `Content-Type: application/json`.
- Token Bearer được tự động gắn vào request nếu có lưu `accessToken`.
- `resolveImageUrl()` hỗ trợ cả ảnh tuyệt đối, ảnh relative từ backend, `data:` và `blob:`.
- Upload ảnh ở trang quản lý sản phẩm hiện chuyển file sang `base64` ngay trên frontend bằng `FileReader`.
- Form đăng ký đang thu thập `phone`, nhưng request đăng ký hiện chỉ gửi `name`, `email`, `password`.
- Tab menu động ở storefront có thể điều hướng bằng `window.location.href` nếu menu có `url`.

## File quan trọng

- [`src/App.jsx`](/Applications/backend/doan3/font%20_end/doan3/src/App.jsx): auth flow và mount giao diện theo người dùng hiện tại.
- [`src/pages/PortalUI.jsx`](/Applications/backend/doan3/font%20_end/doan3/src/pages/PortalUI.jsx): điều phối toàn bộ màn customer/admin.
- [`src/services/apiClient.js`](/Applications/backend/doan3/font%20_end/doan3/src/services/apiClient.js): helper gọi API, auth storage, API static pages/header menu.
- [`src/pages/admin`](/Applications/backend/doan3/font%20_end/doan3/src/pages/admin): các màn quản trị.
- [`src/pages/customer`](/Applications/backend/doan3/font%20_end/doan3/src/pages/customer): các màn storefront.

## Hạn chế hiện tại

- Không có test tự động.
- Không có `react-router`, nên không deep-link được từng trang.
- Nhiều text/UI message đang viết cứng trong component.
- Một số icon dùng emoji trực tiếp trong UI.
- Trang `AboutPage`, `StoreSchemaUI`, `ReviewsPage` hiện không phải phần luồng chính của app.
