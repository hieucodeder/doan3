-- 1
-- add user
DELIMITER //
CREATE PROCEDURE sp_create_user(
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_role VARCHAR(50)
)
BEGIN
    INSERT INTO users(name, email, password, role)
    VALUES(p_name, p_email, p_password, p_role);
END // 
DELIMITER ;

-- lay user
DELIMITER //

CREATE PROCEDURE sp_get_users()
BEGIN
    SELECT * FROM users;
END //
-- 
CALL sp_get_users();
-- login
DELIMITER //

CREATE PROCEDURE sp_login_user(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT id, name, email, role
    FROM users
    WHERE email = p_email
      AND password = p_password
    LIMIT 1;
END //
DELIMITER ;
DROP PROCEDURE sp_login_user;
-- thủ tục mới
DELIMITER //

CREATE PROCEDURE sp_get_user_by_email(
    IN p_email VARCHAR(255)
)
BEGIN
    SELECT * 
    FROM users
    WHERE email = p_email
    LIMIT 1;
END //

DELIMITER ;
-- test
CALL sp_get_user_by_email('admin@gmail.com');
-- đăng ký tài khoản
DELIMITER //

CREATE PROCEDURE sp_register_user(
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_role VARCHAR(50)
)
BEGIN
    DECLARE user_count INT;

    -- kiểm tra email tồn tại
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE email = p_email;

    IF user_count > 0 THEN
        SELECT 'EMAIL_EXISTS' AS message;
    ELSE
        INSERT INTO users(name, email, password, role)
        VALUES(p_name, p_email, p_password, p_role);

        SELECT 'REGISTER_SUCCESS' AS message;
    END IF;
END //

DELIMITER ;
-- test
CALL sp_register_user('User', 'user@gmail.com', '123456', 'user');

-- 2
// add loai
DELIMITER //

CREATE PROCEDURE sp_create_category(
    IN p_name VARCHAR(255),
    IN p_description TEXT
)
BEGIN
    INSERT INTO categories(name, description)
    VALUES(p_name, p_description);
END //

DELIMITER ;

// lay loai
DELIMITER //

CREATE PROCEDURE sp_get_categories()
BEGIN
    SELECT * FROM categories;
END//
DELIMITER ;
call sp_get_categories();
-- 3
// add product
DELIMITER //

CREATE PROCEDURE sp_create_product(
    IN p_name VARCHAR(255),
    IN p_brand VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_stock INT,
    IN p_description TEXT,
    IN p_image_url TEXT,
    IN p_category_id INT
)
BEGIN
    INSERT INTO products(name, brand, price, stock, description, image_url, category_id)
    VALUES(p_name, p_brand, p_price, p_stock, p_description, p_image_url, p_category_id);
END //

DELIMITER ;
SHOW PROCEDURE STATUS WHERE Name = 'sp_create_product';

-- LAY PRODUCT
 DELIMITER //
CREATE PROCEDURE sp_get_products()
BEGIN
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id;
END //
DELIMITER ;
CALL sp_get_products();
-- get product id
DELIMITER //
CREATE PROCEDURE sp_get_product_by_id(IN p_id INT)
BEGIN
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = p_id;
END //
DELIMITER ;
CALL sp_get_product_by_id(1);

-- UPDATE PRODUCT
DELIMITER //
CREATE PROCEDURE sp_update_product(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_stock INT
)
BEGIN
    UPDATE products
    SET name = p_name,
        price = p_price,
        stock = p_stock
    WHERE id = p_id;
END //
DELIMITER ;
-- 4 CART
-- CREATE CART
DELIMITER //
CREATE PROCEDURE sp_create_cart(IN p_user_id INT)
BEGIN
    INSERT INTO cart(user_id) VALUES(p_user_id);
END //
DELIMITER ;
CALL sp_create_cart(1); 
-- 5 CART_ITEMS
-- ADD CART_ITEMS
DELIMITER //
CREATE PROCEDURE sp_add_to_cart(
    IN p_cart_id INT,
    IN p_product_id INT,
    IN p_quantity INT
)
BEGIN
    INSERT INTO cart_items(cart_id, product_id, quantity)
    VALUES(p_cart_id, p_product_id, p_quantity);
END //
DELIMITER ;
CALL sp_add_to_cart(2, 5, 2); 
-- 1: cart_id
-- 5: product_id
-- 2: số lượng
-- get All
DELIMITER //
CREATE PROCEDURE sp_get_cart_items(IN p_user_id INT)
BEGIN
    SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image_url
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = p_user_id;
END //
DELIMITER ;
CALL sp_get_cart_items(2); 
-- 6 ORDERS
-- create ORDERS
DELIMITER //
CREATE PROCEDURE sp_create_order(
    IN p_user_id INT,
    IN p_total DECIMAL(10,2),
    IN p_address TEXT,
    IN p_phone VARCHAR(20)
)
BEGIN
    INSERT INTO orders(user_id, total_price, status, address, phone)
    VALUES(p_user_id, p_total, 'pending', p_address, p_phone);
END //
DELIMITER ;
-- lay ORDERS
DELIMITER //
CREATE PROCEDURE sp_get_orders()
BEGIN
    SELECT * FROM orders;
END //
DELIMITER ;
-- update state
DELIMITER //
CREATE PROCEDURE sp_update_order_status(
    IN p_order_id INT,
    IN p_status VARCHAR(50)
)
BEGIN
    UPDATE orders
    SET status = p_status
    WHERE id = p_order_id;
END //
DELIMITER ;
-- 7
-- add ORDER_ITEMS
DELIMITER //
CREATE PROCEDURE sp_add_order_item(
    IN p_order_id INT,
    IN p_product_id INT,
    IN p_price DECIMAL(10,2),
    IN p_quantity INT
)
BEGIN
    INSERT INTO order_items(order_id, product_id, price, quantity)
    VALUES(p_order_id, p_product_id, p_price, p_quantity);
END //
DELIMITER ;
-- 8 REVIEWS
-- add REVIEWS
DELIMITER //
CREATE PROCEDURE sp_create_review(
    IN p_user_id INT,
    IN p_product_id INT,
    IN p_rating INT,
    IN p_comment TEXT
)
BEGIN
    INSERT INTO reviews(user_id, product_id, rating, comment)
    VALUES(p_user_id, p_product_id, p_rating, p_comment);
END //
DELIMITER ;

-- lấy review theo sản phẩm
DELIMITER //
CREATE PROCEDURE sp_get_reviews_by_product(IN p_product_id INT)
BEGIN
    SELECT r.*, u.name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = p_product_id;
END //
DELIMITER ;