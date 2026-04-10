-- 1
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', '123456', 'admin'),
('Nguyen Van A', 'a@gmail.com', '123456', 'user'),
('Tran Thi B', 'b@gmail.com', '123456', 'user');

-- 2
INSERT INTO categories (name, description) VALUES
('Nước hoa nam', 'Dành cho nam'),
('Nước hoa nữ', 'Dành cho nữ'),
('Unisex', 'Dùng chung nam nữ'),
('Gucci', 'Thương hiệu Gucci'),
('Chanel', 'Thương hiệu Chanel'),
('Dior', 'Thương hiệu Dior'),
('Calvin Klein', 'Thương hiệu CK'),
('Versace', 'Thương hiệu Versace'),
('Armani', 'Thương hiệu Armani'),
('Tom Ford', 'Thương hiệu Tom Ford');

SELECT * FROM categories;

-- 3
INSERT INTO products (name, brand, price, stock, description, image_url, category_id) VALUES
-- ('Dior Sauvage', 'Dior', 2500000, 10, 'Hương nam tính mạnh mẽ', 'https://images.pexels.com/photos/14402573/pexels-photo-14402573.jpeg', 13),
-- ('Chanel No.5', 'Chanel', 3000000, 8, 'Hương nữ cổ điển', 'https://images.pexels.com/photos/22589349/pexels-photo-22589349.jpeg', 12),
('CK One', 'Calvin Klein', 1500000, 15, 'Hương unisex nhẹ nhàng', 'https://images.pexels.com/photos/19074051/pexels-photo-19074051.jpeg', 14),
('Gucci Bloom', 'Gucci', 2600000, 12, 'Hương hoa tươi', 'https://images.pexels.com/photos/9957571/pexels-photo-9957571.jpeg', 11),
('Versace Eros', 'Versace', 2800000, 7, 'Hương nam quyến rũ', 'https://images.pexels.com/photos/32085869/pexels-photo-32085869.jpeg', 15),
('Armani Si', 'Armani', 3100000, 5, 'Hương nữ sang trọng', 'https://images.pexels.com/photos/34690159/pexels-photo-34690159.jpeg', 16),
('Tom Ford Noir', 'Tom Ford', 3500000, 6, 'Hương unisex mạnh mẽ', 'https://images.pexels.com/photos/34143831/pexels-photo-34143831.jpeg', 17),
('Chanel Bleu', 'Chanel', 2700000, 9, 'Hương nam lịch lãm', 'https://images.pexels.com/photos/22589359/pexels-photo-22589359.jpeg', 12),
('CK Eternity', 'Calvin Klein', 1800000, 14, 'Hương unisex nhẹ nhàng', 'https://images.pexels.com/photos/11295237/pexels-photo-11295237.jpeg',12);

SELECT * FROM products;
-- 4
INSERT INTO cart (user_id) VALUES
(2),
(3);
-- 5
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 1);
-- 6
INSERT INTO orders (user_id, total_price, status, address, phone) VALUES
(2, 6500000, 'pending', 'Hà Nội', '0123456789'),
(3, 3000000, 'shipping', 'TP HCM', '0987654321');
-- 7
INSERT INTO order_items (order_id, product_id, price, quantity) VALUES
(1, 1, 2500000, 2),
(1, 3, 1500000, 1),
(2, 2, 3000000, 1);
-- 8
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Mùi rất thơm, giữ lâu'),
(3, 2, 4, 'Hương nhẹ nhàng, dễ chịu'),
(2, 3, 5, 'Giá tốt, đáng mua');

--
-- Xoá theo thứ tự để tránh lỗi FK
-- Tắt safe update tạm thời
SET SQL_SAFE_UPDATES = 0;

-- Xoá dữ liệu bảng
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM cart;
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- Bật lại safe update nếu muốn
SET SQL_SAFE_UPDATES = 1;