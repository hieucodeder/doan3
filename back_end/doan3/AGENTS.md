# AGENTS.md

Tài liệu này dành cho người sửa code hoặc coding agent làm việc trong repository backend này.

## Mục tiêu repo

Đây là backend Express/MySQL cho hệ thống bán hàng. Hầu hết nghiệp vụ nằm ở stored procedure MySQL; code Node.js chủ yếu làm 4 việc:

1. nhận request HTTP
2. validate dữ liệu đầu vào
3. gọi service/database
4. chuẩn hóa response và mã lỗi

## Kiến trúc bắt buộc phải giữ

Luồng chuẩn:

```text
Route -> Controller -> Service -> MySQL / Stored Procedure
```

Quy ước hiện tại:

- `src/routes`: chỉ khai báo endpoint và map controller
- `src/controllers`: validate request, trả status code, không chứa SQL
- `src/services`: gọi `db.query(...)`, xử lý mapping field giữa frontend và DB
- `src/config/db.js`: pool kết nối dùng chung
- `src/middlewares/authMiddleware.js`: xác thực JWT

Không nên nhảy tầng, ví dụ:

- không viết SQL trực tiếp trong controller
- không nhét logic HTTP vào service
- không truy cập DB trực tiếp từ route

## Những điểm quan trọng theo code hiện tại

### Authentication

- Chỉ `/api/auth/*` là public.
- Các route còn lại đang được bọc `authenticate` tại [src/index.js](/Applications/backend/doan3/back_end/doan3/src/index.js:1).
- JWT payload hiện gồm `id`, `email`, `role`.

### Database-first design

Service đang phụ thuộc vào stored procedure như:

- `sp_register_user`
- `sp_create_product`
- `sp_checkout_order`
- `sp_get_all_product_showcases`
- `sp_add_header_menu`

Khi sửa nghiệp vụ, luôn kiểm tra:

1. change này nằm ở Node.js hay phải sửa SQL/procedure
2. shape dữ liệu trả về từ procedure có đổi không
3. controller có đang dựa vào `rows[0]`, `rows[0][0]`, hoặc `message` sentinel hay không

### Mapping frontend <-> database

Một số module không dùng tên field DB trực tiếp:

- `headerService`
  - `name -> site_name`
  - `description -> banner_text`
  - `label -> name`
  - `url -> link`
  - `order -> position`
- `productShowcaseService`
  - quản lý bảng `product_showcases`
  - mỗi bản ghi giới thiệu gắn với `product_id`

Khi thêm field mới cho frontend, cần cập nhật cả hai chiều mapping.

### Product service có transaction

[src/services/productService.js](/Applications/backend/doan3/back_end/doan3/src/services/productService.js:1) là module nhạy cảm hơn phần còn lại:

- dùng `getConnection()`
- `beginTransaction / commit / rollback`
- có fallback để lấy `product_id`

Nếu sửa file này, phải giữ nguyên hành vi rollback khi bất kỳ bước nào lỗi.

## Nguyên tắc sửa code

- Giữ style CommonJS hiện tại (`require/module.exports`).
- Giữ tiếng Việt cho message API để đồng nhất với codebase.
- Ưu tiên sửa nhỏ, đúng tầng, ít lan.
- Nếu response contract đang được frontend dùng, không đổi shape JSON nếu chưa xác nhận tác động.
- Với module dựa vào message sentinel như `EMAIL_EXISTS`, `CART_EMPTY`, `OUT_OF_STOCK`, `PRODUCT_IN_ORDER`, phải giữ tương thích ngược nếu có thể.

## Khi thêm endpoint mới

Thực hiện theo thứ tự:

1. thêm route trong `src/routes/*`
2. thêm handler trong controller tương ứng
3. thêm function ở service
4. cập nhật `src/index.js` nếu là module mới
5. cập nhật `README.md` nếu public API thay đổi

Checklist tối thiểu:

- validate input đầy đủ
- status code hợp lý
- response có `success`
- lỗi DB không làm rò rỉ thông tin nhạy cảm

## Khi sửa auth hoặc user

- Kiểm tra tác động tới `req.user`.
- Kiểm tra tất cả route protected còn hoạt động.
- Lưu ý: source hiện chưa hash password ở tầng Node.js; nếu thay đổi cơ chế auth thì cần migration rõ ràng.

## Khi sửa header/product showcase

Đây là phần mới hơn trong codebase và đang làm adapter giữa frontend đơn giản với DB phức tạp hơn. Khi sửa:

- kiểm tra lại mapping field
- không bỏ các field backward-compatible đang được trả về
- cẩn thận với boolean `is_active`

## Testing và xác minh

Repo hiện chưa có test tự động. Khi thay đổi code:

- ít nhất chạy server local nếu có thể
- kiểm tra syntax file sửa
- nếu đổi endpoint, nên thử bằng request mẫu hoặc mô tả chính xác body/query/response kỳ vọng

## Tài liệu cần cập nhật cùng code

Nếu thay đổi các phần sau, cập nhật lại `README.md`:

- endpoint
- env vars
- scripts chạy dự án
- kiến trúc module
- yêu cầu database/procedure

## Không nên làm

- Không hardcode secret mới vào source.
- Không đổi tên field response hàng loạt nếu chưa kiểm tra frontend.
- Không chuyển sang ESM hoặc TypeScript từng phần nếu không có chủ đích refactor rõ ràng.
- Không bỏ transaction trong luồng tạo sản phẩm.
- Không đưa SQL inline vào controller để “fix nhanh”.
