-- 1
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', '123456', 'admin'),
('Nguyen Van A', 'a@gmail.com', '123456', 'user'),
('Tran Thi B', 'b@gmail.com', '123456', 'user');
-- 2
INSERT INTO categories (name, description) VALUES
('Nước hoa nam', 'Dành cho nam'),
('Nước hoa nữ', 'Dành cho nữ'),
('Unisex', 'Dùng chung nam nữ');
-- 3
INSERT INTO products (name, brand, price, stock, description, image_url, category_id) VALUES
('Dior Sauvage', 'Dior', 2500000, 10, 'Hương nam tính mạnh mẽ', 'dior.jpg', 1),
('Chanel No.5', 'Chanel', 3000000, 8, 'Hương nữ cổ điển', 'chanel.jpg', 2),
('CK One', 'Calvin Klein', 1500000, 15, 'Hương unisex nhẹ nhàng', 'ck.jpg', 3);
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