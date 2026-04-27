# AGENTS.md

Tài liệu này dành cho người hoặc coding agent tiếp tục làm việc trong repo.

## Mục tiêu repo

Đây là frontend cho shop nước hoa `NGỌC ÁNH`. App có 2 chế độ:

- `customer`: storefront và quy trình mua hàng
- `admin`: dashboard và CRUD dữ liệu vận hành

Không có routing theo URL. Mọi chuyển trang nằm trong state của React component.

## Stack và lệnh chạy

- Package manager: `npm`
- Framework: React 19 + Vite
- Entry: [`src/main.jsx`](/Applications/backend/doan3/font%20_end/doan3/src/main.jsx)
- App shell: [`src/App.jsx`](/Applications/backend/doan3/font%20_end/doan3/src/App.jsx)

Lệnh thường dùng:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Biến môi trường:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Kiến trúc nhanh

### 1. Auth

- `App.jsx` là nơi login/register/logout.
- `currentUser` được lấy từ `localStorage` qua `getStoredUser()`.
- `accessToken` lưu dưới key `accessToken`.
- Nếu không có user, app chỉ render `Login` hoặc `Register`.

### 2. Điều phối giao diện

- `PortalUI.jsx` quyết định hiển thị customer hay admin theo `role`.
- Customer tabs: `home`, `detail`, `cart`, `checkout`, `my-orders`, `about`
- Admin tabs: `dashboard`, `products`, `orders`, `users`, `categories`, `static-pages`, `headers`

### 3. API layer

- Tập trung ở [`src/services/apiClient.js`](/Applications/backend/doan3/font%20_end/doan3/src/services/apiClient.js)
- `apiRequest()` là helper chung cho hầu hết request.
- Mọi request mặc định gửi JSON.
- Authorization header được thêm tự động nếu có token và không bật `skipAuth`.
- File này cũng chứa helper CRUD cho `static-pages` và `headers/menus`.

## Bản đồ thư mục

```text
src/
  components/
    TopNav.jsx
    ShopFooter.jsx
    TableView.jsx
  pages/
    Login.jsx
    Register.jsx
    PortalUI.jsx
    admin/
    customer/
  services/
    apiClient.js
  data/
    mockData.js
```

## Trách nhiệm theo file

- `src/App.jsx`
  - login/register/logout
  - chuyển giữa auth screen và app screen
- `src/pages/PortalUI.jsx`
  - load categories/products/cart
  - customer tab switching
  - admin tab switching
- `src/components/TopNav.jsx`
  - top navigation của cả customer lẫn admin
  - search debounce 400ms
  - load menu động từ header active
- `src/pages/customer/HomePage.jsx`
  - list sản phẩm theo danh mục
  - tự fetch review từng sản phẩm để tính rating trung bình
- `src/pages/customer/ProductDetailPage.jsx`
  - chi tiết sản phẩm
  - gallery ảnh
  - thêm giỏ hàng, mua ngay
  - review submit
- `src/pages/customer/CartPage.jsx`
  - render giỏ hàng từ `cartItems` + `productsData`
- `src/pages/customer/CheckoutPage.jsx`
  - gửi `POST /api/orders/checkout`
- `src/pages/customer/MyOrdersPage.jsx`
  - lịch sử đơn hàng user
  - lọc theo trạng thái
  - xem chi tiết / hủy đơn
- `src/pages/admin/*.jsx`
  - mỗi file là một màn admin độc lập gọi backend trực tiếp

## Quy ước dữ liệu hiện tại

- `role === 'admin'` thì vào admin UI, mọi role khác coi là customer.
- Product image có thể đến từ:
  - `thumbnail`
  - `images[0]`
  - `image_url`
  - `image`
- `resolveImageUrl()` chuẩn hóa ảnh relative từ backend.
- Giá được format qua `formatPrice()` trong `src/data/mockData.js`.

## Các endpoint app đang phụ thuộc

Nhóm auth:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/users/check-status`

Nhóm customer:

- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/search`
- `GET /api/reviews/:productId`
- `POST /api/reviews`
- `GET /api/cart-items/:userId`
- `POST /api/cart-items`
- `PUT /api/cart-items`
- `DELETE /api/cart-items`
- `POST /api/orders/checkout`
- `GET /api/orders/user/:userId`
- `GET /api/orders/history/:orderId`
- `PATCH /api/orders/:orderId/cancel`

Nhóm admin:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/top-products`
- `GET/POST/PUT/DELETE` cho `products`, `categories`, `static-pages`, `headers`
- `GET /api/orders`
- `GET /api/orders/:id/detail`
- `PUT /api/orders/:id/status`
- `GET /api/users`
- `PATCH /api/users/:id/status`
- `PUT /api/users/email`
- `GET /api/headers/:headerId/menus`
- `POST /api/headers/:headerId/menus`
- `PUT /api/headers/menus/:menuId`
- `DELETE /api/headers/menus/:menuId`
- `PUT /api/headers/menus/:menuId/toggle`

## Điểm cần lưu ý khi sửa code

- Không thêm `react-router` nếu chưa có chủ đích rõ ràng; app hiện phụ thuộc mạnh vào tab state.
- `PortalUI.jsx` là file trung tâm, sửa ở đây dễ ảnh hưởng cả customer lẫn admin.
- `TopNav.jsx` có 2 nhánh UI khác nhau trong cùng một component.
- `HomePage.jsx` đang gọi nhiều request review song song, nên nếu tối ưu hiệu năng hãy bắt đầu từ đây.
- `ProductsPage.jsx` hiện chỉ gửi `images` khi tạo mới; nhánh update chưa gửi lại danh sách ảnh.
- `Register.jsx` thu thập `phone` nhưng `App.jsx` chưa gửi trường này lên backend.
- `MyOrdersPage.jsx` dùng `/api/orders/history/:orderId`, còn `OrdersPage.jsx` dùng `/api/orders/:id/detail`; backend phải support cả hai nếu giữ nguyên frontend.
- Menu động customer có thể `window.location.href` sang URL bất kỳ, nên thay đổi ở `HeadersPage` có thể tác động trực tiếp đến điều hướng storefront.

## Cách làm việc an toàn trong repo này

- Sau khi sửa code, ưu tiên chạy:

```bash
npm run build
npm run lint
```

- Nếu thay đổi API contract, cập nhật cả:
  - `src/services/apiClient.js`
  - component gọi API
  - `README.md`
- Nếu đụng tới auth storage, kiểm tra lại login/logout và reload trang.
- Nếu đụng tới `PortalUI`, test ít nhất:
  - login customer
  - add/remove cart item
  - checkout
  - login admin
  - CRUD hoặc load ít nhất một màn admin

## Ưu tiên cải thiện nếu tiếp tục phát triển

- Thêm routing thật bằng `react-router`
- Tách API layer theo domain thay vì dồn trong một file
- Thêm loading/error handling nhất quán
- Viết test cho auth flow, cart flow, orders flow
- Tách modal inline styles sang component/CSS riêng
