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
-- active user
DELIMITER //

CREATE PROCEDURE sp_toggle_user_status(
    IN p_id INT,
    IN p_status TINYINT  -- 1: bật, 0: tắt
)
BEGIN
    UPDATE users
    SET is_active = p_status
    WHERE id = p_id;
END //

DELIMITER ;

CALL sp_toggle_user_status(4, 1);
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
	AND is_active = 1   -- ✅ thêm dòng này
    LIMIT 1;
END //
DELIMITER ;
DROP PROCEDURE sp_get_orders_by_user_with_status;
-- thủ tục mới login
DELIMITER //

CREATE PROCEDURE sp_get_user_by_email(
    IN p_email VARCHAR(255)
)
BEGIN
    SELECT * 
    FROM users
    WHERE email = p_email
          AND is_active = 1   -- ✅ chặn user bị khóa
    LIMIT 1;
END //

DELIMITER ;
-- test
CALL sp_get_user_by_email('admin@gmail.com');
-- PUT user
DELIMITER //

CREATE PROCEDURE sp_update_user_by_email(
    IN p_email VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_new_email VARCHAR(255)
)
BEGIN
    UPDATE users
    SET 
        name = p_name,
        email = p_new_email
    WHERE email = p_email
      AND is_active = 1; -- chỉ update user còn hoạt động
END //

DELIMITER ;
CALL sp_update_user_by_email(
    'a@gmail.com',
    'Nguyen Van A Updated',
    'a_new@gmail.com'
);
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
CALL sp_register_user('NVC', 'NVC@gmail.com', '123456', 'user');

-- 2
-- add loai
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
-- Xoá được nếu k có sản phẩm trong loại
DELIMITER //

CREATE PROCEDURE sp_delete_category(
    IN p_id INT
)
BEGIN
    DECLARE v_count INT;

    -- kiểm tra có product không
    SELECT COUNT(*) INTO v_count
    FROM products
    WHERE category_id = p_id;

    IF v_count > 0 THEN
        SELECT 'CATEGORY_HAS_PRODUCTS' AS message;
    ELSE
        DELETE FROM categories
        WHERE id = p_id;

        SELECT 'DELETE_SUCCESS' AS message;
    END IF;

END //

DELIMITER ;
CALL sp_delete_category(18);
-- 3 add 
DELIMITER //

CREATE PROCEDURE sp_create_product(
    IN p_name VARCHAR(255),
    IN p_brand VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_stock INT,
    IN p_description TEXT,
    IN p_category_id INT
)
BEGIN
    INSERT INTO products(name, brand, price, stock, description, category_id)
    VALUES(p_name, p_brand, p_price, p_stock, p_description, p_category_id);

    SELECT LAST_INSERT_ID() AS product_id;

END //

DELIMITER ;
-- add ảnh vào bảng image
DELIMITER //

CREATE PROCEDURE sp_add_product_image(
    IN p_product_id INT,
    IN p_image_url TEXT
)
BEGIN
    INSERT INTO product_images(product_id, image_url)
    VALUES(p_product_id, p_image_url);
END //

DELIMITER 
DELETE FROM product_images WHERE product_id = p_id;

-- insert lại toàn bộ ảnh mới
DROP PROCEDURE IF EXISTS sp_create_product; 
SHOW PROCEDURE STATUS WHERE Name = 'sp_create_product';
-- PUT product
DELIMITER //

CREATE PROCEDURE sp_update_product_full(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_brand VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_stock INT,
    IN p_description TEXT,
    IN p_category_id INT
)
BEGIN
    UPDATE products
    SET 
        name        = COALESCE(p_name,        name),
        brand       = COALESCE(p_brand,       brand),
        price       = COALESCE(p_price,       price),
        stock       = COALESCE(p_stock,       stock),
        description = COALESCE(p_description, description),
        category_id = COALESCE(p_category_id, category_id)
    WHERE id = p_id;
END //

DELIMITER ;
-- delete product khi chưa có đơn hàng nào có sản phẩm đó
DELIMITER //

CREATE PROCEDURE sp_delete_product(
    IN p_id INT
)
BEGIN
    DECLARE v_count INT;

    -- kiểm tra đã có trong order chưa
    SELECT COUNT(*) INTO v_count
    FROM order_items
    WHERE product_id = p_id;

    IF v_count > 0 THEN
        SELECT 'PRODUCT_IN_ORDER' AS message;

    ELSE
        -- ❗ xoá ảnh trước (QUAN TRỌNG)
        DELETE FROM product_images WHERE product_id = p_id;

        -- xoá cart
        DELETE FROM cart_items WHERE product_id = p_id;

        -- xoá review
        DELETE FROM reviews WHERE product_id = p_id;

        -- xoá product
        DELETE FROM products WHERE id = p_id;

        SELECT 'DELETE_SUCCESS' AS message;
    END IF;

END //

DELIMITER ;
CALL sp_delete_product(28);
DELIMITER ;

-- LAY PRODUCT
DELIMITER //

CREATE PROCEDURE sp_get_products()
BEGIN
    SELECT 
        p.id,
        p.name,
        p.brand,
        p.price,
        p.stock,
        p.description,
        c.name AS category_name,

        -- lấy 1 ảnh đại diện
        (SELECT pi.image_url 
         FROM product_images pi 
         WHERE pi.product_id = p.id 
         LIMIT 1) AS thumbnail

    FROM products p
    JOIN categories c ON p.category_id = c.id;
END //

DELIMITER ;
CALL sp_get_products();
-- get product id
DROP PROCEDURE IF EXISTS sp_update_product_full; 
DELIMITER //

CREATE PROCEDURE sp_get_product_by_id(IN p_id INT)
BEGIN
    SELECT
        p.id,
        p.name,
        p.brand,
        p.price,
        p.stock,
        p.description,
        c.name AS category_name,

        COALESCE(
            (
                SELECT JSON_ARRAYAGG(pi.image_url)
                FROM product_images pi
                WHERE pi.product_id = p.id
            ),
            JSON_ARRAY()
        ) AS images

    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = p_id
    LIMIT 1;
END //

DELIMITER ;
CALL sp_get_product_by_id(21);

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
-- serach product
DELIMITER //

CREATE PROCEDURE sp_search_products(
    IN p_keyword VARCHAR(255),      -- Từ khóa tìm kiếm trong name hoặc brand
    IN p_category_id INT             -- Tìm theo category_id (0 = tất cả)
)
BEGIN
    SELECT *
    FROM products
    WHERE 
        (name LIKE CONCAT('%', p_keyword, '%') 
         OR brand LIKE CONCAT('%', p_keyword, '%'))
        AND (p_category_id = 0 OR category_id = p_category_id)
    ORDER BY created_at DESC;
END //

DELIMITER ;
CALL sp_search_products('Dior', 2);
-- 5 CART_ITEMS
-- ADD CART_ITEMS

DELIMITER //
CREATE PROCEDURE sp_add_to_cart(IN p_user_id INT, IN p_product_id INT, IN p_quantity INT)
BEGIN
    DECLARE v_cart_id INT;

    -- kiểm tra cart đã tồn tại chưa
    SELECT id INTO v_cart_id
    FROM cart
    WHERE user_id = p_user_id
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        INSERT INTO cart(user_id) VALUES(p_user_id);
        SET v_cart_id = LAST_INSERT_ID();
    END IF;

    -- thêm vào cart_items (có thể cộng dồn quantity nếu muốn)
    INSERT INTO cart_items(cart_id, product_id, quantity)
    VALUES(v_cart_id, p_product_id, p_quantity);
END //
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_get_product_by_id; 
CALL sp_add_to_cart(3, 2, 2); 
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
CALL sp_get_cart_items(3); 

-- remove
DELIMITER //
CREATE PROCEDURE sp_remove_cart_item(
    IN p_user_id INT,       -- ID của user
    IN p_product_id INT     -- ID sản phẩm cần xóa
)
BEGIN
    DECLARE v_cart_id INT;

    -- Lấy cart_id của user
    SELECT id INTO v_cart_id
    FROM cart
    WHERE user_id = p_user_id
    LIMIT 1;

    -- Nếu cart tồn tại thì xóa item
    IF v_cart_id IS NOT NULL THEN
        DELETE FROM cart_items
        WHERE cart_id = v_cart_id
          AND product_id = p_product_id;
    END IF;
END //
DELIMITER ;
-- Xóa sản phẩm có product_id = 2 của user_id = 3
CALL sp_remove_cart_item(3, 5);

-- Kiểm tra lại giỏ hàng
CALL sp_get_cart_items(3);
-- sửa số lượng
DELIMITER //
CREATE PROCEDURE sp_update_cart_item_quantity(
    IN p_user_id INT,       -- ID của user
    IN p_product_id INT,    -- ID sản phẩm cần chỉnh
    IN p_quantity INT       -- Số lượng mới
)
BEGIN
    DECLARE v_cart_id INT;

    -- Lấy cart_id của user
    SELECT id INTO v_cart_id
    FROM cart
    WHERE user_id = p_user_id
    LIMIT 1;

    -- Nếu cart tồn tại và quantity > 0 thì cập nhật
    IF v_cart_id IS NOT NULL THEN
        IF p_quantity > 0 THEN
            UPDATE cart_items
            SET quantity = p_quantity
            WHERE cart_id = v_cart_id
              AND product_id = p_product_id;
        ELSE
            -- Nếu số lượng <= 0 thì xóa sản phẩm khỏi giỏ
            DELETE FROM cart_items
            WHERE cart_id = v_cart_id
              AND product_id = p_product_id;
        END IF;
    END IF;
END //
DELIMITER ;
-- Cập nhật số lượng sản phẩm product_id = 2 của user_id = 3 thành 5
CALL sp_update_cart_item_quantity(2, 6, 4);

-- Kiểm tra lại giỏ hàng
CALL sp_get_cart_items(2);

-- Nếu muốn xóa sản phẩm luôn (quantity = 0)
CALL sp_update_cart_item_quantity(3, 2, 0);
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
CALL sp_get_orders

DELIMITER //

CREATE PROCEDURE sp_get_orders()
BEGIN
    SELECT 
        o.id,
        o.name AS customer_name,
        o.total_price,
        o.status,
        o.address,
        o.phone,
        o.created_at,
        u.name AS user_name,
        u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC;
END //

DELIMITER ;
-- update state

DELIMITER //

CREATE PROCEDURE sp_update_order_status(
    IN p_order_id INT,
    IN p_status VARCHAR(50)
)
BEGIN
    DECLARE v_old_status VARCHAR(50);

    -- lấy trạng thái hiện tại
    SELECT status INTO v_old_status
    FROM orders
    WHERE id = p_order_id;

    -- ❌ không cho update nếu đã cancel hoặc completed
    IF v_old_status IN ('cancelled', 'completed') THEN
        SELECT 'CANNOT_UPDATE' AS message;

    ELSEIF v_old_status = p_status THEN
        SELECT 'NO_CHANGE' AS message;

    ELSE

        -- update trạng thái
        UPDATE orders
        SET status = p_status
        WHERE id = p_order_id;

        -- lưu lịch sử
        INSERT INTO order_history(order_id, status, note)
        VALUES(
            p_order_id,
            p_status,
            CONCAT('Admin: ', v_old_status, ' -> ', p_status)
        );

        SELECT 'UPDATE_SUCCESS' AS message;

    END IF;

END //

DELIMITER ;
DROP PROCEDURE sp_get_orders;
CALL sp_checkout_order(4, 'Hà Nội', '0987');
CALL sp_checkout_order(4, 'Hà Nội', '0987...');
CALL sp_update_order_status(15, 'shipping');
CALL sp_get_order_history_by_user(2);

-- thanh toan
-- DELIMITER //
-- CREATE PROCEDURE sp_checkout_order(
--     IN p_user_id INT,      -- ID của user
--     IN p_address TEXT,     -- Địa chỉ giao hàng
--     IN p_phone VARCHAR(20) -- Số điện thoại
-- )
-- BEGIN
--     DECLARE v_cart_id INT;
--     DECLARE v_total DECIMAL(10,2);
--     DECLARE done INT DEFAULT 0;

--     -- con trỏ để duyệt từng sản phẩm trong cart
--     DECLARE cur_product_id INT;
--     DECLARE cur_price DECIMAL(10,2);
--     DECLARE cur_quantity INT;

--     DECLARE cur CURSOR FOR
--         SELECT p.id, p.price, ci.quantity
--         FROM cart_items ci
--         JOIN cart c ON ci.cart_id = c.id
--         JOIN products p ON ci.product_id = p.id
--         WHERE c.user_id = p_user_id;

--     DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

--     -- Lấy cart_id của user
--     SELECT id INTO v_cart_id
--     FROM cart
--     WHERE user_id = p_user_id
--     LIMIT 1;

--     -- Nếu giỏ hàng trống thì dừng thủ tục
--     IF v_cart_id IS NULL THEN
--         SELECT 'CART_EMPTY' AS message;
--     ELSE
--         -- Tính tổng tiền
--         SELECT SUM(p.price * ci.quantity) INTO v_total
--         FROM cart_items ci
--         JOIN cart c ON ci.cart_id = c.id
--         JOIN products p ON ci.product_id = p.id
--         WHERE c.user_id = p_user_id;

--         -- Tạo đơn hàng
--         INSERT INTO orders(user_id, total_price, status, address, phone)
--         VALUES(p_user_id, v_total, 'pending', p_address, p_phone);

--         SET @v_order_id = LAST_INSERT_ID();

--         -- Thêm từng item vào order_items
--         OPEN cur;
--         read_loop: LOOP
--             FETCH cur INTO cur_product_id, cur_price, cur_quantity;
--             IF done THEN
--                 LEAVE read_loop;
--             END IF;

--             INSERT INTO order_items(order_id, product_id, price, quantity)
--             VALUES(@v_order_id, cur_product_id, cur_price, cur_quantity);
--         END LOOP;
--         CLOSE cur;

--         -- Xóa giỏ hàng
--         DELETE FROM cart_items WHERE cart_id = v_cart_id;

--         SELECT 'ORDER_SUCCESS' AS message, @v_order_id AS order_id;
--     END IF;
-- END //
-- DELIMITER ;
-- DELIMITER //

-- CREATE PROCEDURE sp_checkout_order(
--     IN p_user_id INT,
--     IN p_address TEXT,
--     IN p_phone VARCHAR(20)
-- )
-- BEGIN
--     DECLARE v_cart_id INT;
--     DECLARE v_total DECIMAL(10,2);
--     DECLARE done INT DEFAULT 0;

--     DECLARE cur_product_id INT;
--     DECLARE cur_price DECIMAL(10,2);
--     DECLARE cur_quantity INT;

--     DECLARE cur CURSOR FOR
--         SELECT p.id, p.price, ci.quantity
--         FROM cart_items ci
--         JOIN cart c ON ci.cart_id = c.id
--         JOIN products p ON ci.product_id = p.id
--         WHERE c.user_id = p_user_id;

--     DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

--     SELECT id INTO v_cart_id
--     FROM cart
--     WHERE user_id = p_user_id
--     LIMIT 1;

--     IF v_cart_id IS NULL THEN
--         SELECT 'CART_EMPTY' AS message;
--     ELSE

--         SELECT SUM(p.price * ci.quantity) INTO v_total
--         FROM cart_items ci
--         JOIN cart c ON ci.cart_id = c.id
--         JOIN products p ON ci.product_id = p.id
--         WHERE c.user_id = p_user_id;

--         -- tạo đơn hàng
--         INSERT INTO orders(user_id, total_price, status, address, phone)
--         VALUES(p_user_id, v_total, 'pending', p_address, p_phone);

--         SET @v_order_id = LAST_INSERT_ID();

--         -- ✅ THÊM DÒNG NÀY (quan trọng)
--         INSERT INTO order_history(order_id, status, note)
--         VALUES(@v_order_id, 'pending', 'Đơn hàng vừa được tạo');

--         -- thêm item
--         OPEN cur;
--         read_loop: LOOP
--             FETCH cur INTO cur_product_id, cur_price, cur_quantity;
--             IF done THEN
--                 LEAVE read_loop;
--             END IF;

--             INSERT INTO order_items(order_id, product_id, price, quantity)
--             VALUES(@v_order_id, cur_product_id, cur_price, cur_quantity);
--         END LOOP;
--         CLOSE cur;

--         DELETE FROM cart_items WHERE cart_id = v_cart_id;

--         SELECT 'ORDER_SUCCESS' AS message, @v_order_id AS order_id;
--     END IF;
-- END //

-- DELIMITER ;
-- thanh toán 
DELIMITER //

CREATE PROCEDURE sp_checkout_order(
    IN p_user_id INT,
    IN p_address TEXT,
    IN p_phone VARCHAR(20),
	IN p_name VARCHAR(255)      
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_total DECIMAL(10,2);
    DECLARE done INT DEFAULT 0;

    DECLARE cur_product_id INT;
    DECLARE cur_price DECIMAL(10,2);
    DECLARE cur_quantity INT;
    DECLARE v_stock INT;

    DECLARE cur CURSOR FOR
        SELECT p.id, p.price, ci.quantity
        FROM cart_items ci
        JOIN cart c ON ci.cart_id = c.id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = p_user_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Lấy cart
    SELECT id INTO v_cart_id
    FROM cart
    WHERE user_id = p_user_id
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        SELECT 'CART_EMPTY' AS message;

    ELSE

        -- ❗ BƯỚC 1: CHECK STOCK
        SELECT COUNT(*) INTO @out_of_stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        JOIN cart c ON ci.cart_id = c.id
        WHERE c.user_id = p_user_id
          AND ci.quantity > p.stock;

        IF @out_of_stock > 0 THEN
            SELECT 'OUT_OF_STOCK' AS message;

        ELSE

            -- tính tiền
            SELECT SUM(p.price * ci.quantity) INTO v_total
            FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = p_user_id;

            -- tạo order
			INSERT INTO orders(user_id, total_price, status, address, phone, name)
			VALUES(p_user_id, v_total, 'pending', p_address, p_phone, p_name);

            SET @v_order_id = LAST_INSERT_ID();

            -- lưu lịch sử
            INSERT INTO order_history(order_id, status, note)
            VALUES(@v_order_id, 'pending', 'Đơn hàng vừa được tạo');

            -- ❗ BƯỚC 2: TRỪ STOCK + INSERT ITEM
            OPEN cur;
            read_loop: LOOP
                FETCH cur INTO cur_product_id, cur_price, cur_quantity;
                IF done THEN
                    LEAVE read_loop;
                END IF;

                -- trừ tồn kho
                UPDATE products
                SET stock = stock - cur_quantity
                WHERE id = cur_product_id;

                -- thêm order item
                INSERT INTO order_items(order_id, product_id, price, quantity)
                VALUES(@v_order_id, cur_product_id, cur_price, cur_quantity);

            END LOOP;
            CLOSE cur;

            -- xoá cart
            DELETE FROM cart_items WHERE cart_id = v_cart_id;

            SELECT 'ORDER_SUCCESS' AS message, @v_order_id AS order_id;

        END IF;

    END IF;

END //

DELIMITER ;
DROP PROCEDURE sp_checkout_order;
-- User ID 3 đặt hàng
CALL sp_checkout_order(4, '123 Nguyễn Trãi, Hà Nội', '0987654321');

-- Kiểm tra đơn hàng vừa tạo
SELECT * FROM orders WHERE user_id = 3;

-- Kiểm tra chi tiết đơn hàng
SELECT * FROM order_items WHERE order_id = LAST_INSERT_ID();
-- Huỷ đơn hàng hoàn tồn 
DELIMITER //

CREATE PROCEDURE sp_cancel_order_by_user(
    IN p_order_id INT,
    IN p_user_id INT
)
BEGIN
    DECLARE v_status VARCHAR(50);

    -- lấy trạng thái
    SELECT status INTO v_status
    FROM orders
    WHERE id = p_order_id
      AND user_id = p_user_id
    LIMIT 1;

    -- không tìm thấy
    IF v_status IS NULL THEN
        SELECT 'ORDER_NOT_FOUND' AS message;

    -- không phải pending
    ELSEIF v_status <> 'pending' THEN
        SELECT 'CANNOT_CANCEL' AS message;

    ELSE

        -- ✅ update chỉ khi còn pending (chống gọi lại)
        UPDATE orders
        SET status = 'cancelled'
        WHERE id = p_order_id
          AND status = 'pending';

        -- nếu update thành công mới làm tiếp
        IF ROW_COUNT() > 0 THEN

            -- hoàn lại kho
            UPDATE products p
            JOIN order_items oi ON p.id = oi.product_id
            SET p.stock = p.stock + oi.quantity
            WHERE oi.order_id = p_order_id;

            -- lưu lịch sử
            INSERT INTO order_history(order_id, status, note)
            VALUES(p_order_id, 'cancelled', 'User đã huỷ đơn hàng');

            SELECT 'CANCEL_SUCCESS' AS message;

        ELSE
            SELECT 'CANNOT_CANCEL' AS message;
        END IF;

    END IF;

END //

DELIMITER ;
CALL sp_cancel_order_by_user(21, 4);
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
-- oder history
DELIMITER //

CREATE PROCEDURE sp_get_order_history_by_user(
    IN p_order_id INT
)
BEGIN
    SELECT 
        oi.product_id,
        p.name AS product_name,
        oi.price,
        oi.quantity,
        (oi.price * oi.quantity) AS subtotal,

        -- lấy ảnh đầu tiên từ product_images thay vì products.image_url
        (SELECT pi.image_url 
         FROM product_images pi 
         WHERE pi.product_id = p.id 
         LIMIT 1) AS image_url

    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = p_order_id;
END //

DELIMITER ;
CALL sp_get_order_history_by_user(2);
DROP PROCEDURE sp_get_order_history_by_user;

-- showw đơn hàng theo trạng thái
DELIMITER //

CREATE PROCEDURE sp_get_orders_by_user_with_status(
    IN p_user_id INT,
    IN p_status VARCHAR(50)
)
BEGIN
    SELECT 
        id AS order_id,
        name,
        total_price,
        address,
        phone,
        status,
        created_at
    FROM orders
    WHERE user_id = p_user_id
      AND (p_status IS NULL OR status = p_status)
    ORDER BY created_at DESC;
END //

DELIMITER ;

CALL sp_get_orders_by_user_with_status(4, 'completed');
-- oder history detail
DELIMITER //

CREATE PROCEDURE sp_get_order_detail(
    IN p_order_id INT
)
BEGIN
    SELECT 
        o.id AS order_id,
        o.total_price,
        o.address,
        o.phone,
        
        p.id AS product_id,
        p.name AS product_name,
        p.image_url,
        
        oi.price,
        oi.quantity,
        (oi.price * oi.quantity) AS subtotal

    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id

    WHERE o.id = p_order_id;
END //

DELIMITER ;
CALL sp_get_order_detail(16);
-- dasboard
DELIMITER //

CREATE PROCEDURE sp_dashboard_summary()
BEGIN
    SELECT 
        -- Tổng doanh thu (chỉ tính đơn completed)
        IFNULL(SUM(total_price), 0) AS total_revenue,

        -- Tổng đơn hàng
        COUNT(*) AS total_orders,

        -- Đơn hoàn thành
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,

        -- Tổng sản phẩm
        (SELECT COUNT(*) FROM products) AS total_products

    FROM orders;
END //

DELIMITER ;
-- TOP 5
DELIMITER //

CREATE PROCEDURE sp_top_selling_products()
BEGIN
    SELECT 
        p.id,
        p.name AS product_name,
        
        IFNULL(SUM(oi.quantity), 0) AS total_sold,
        p.price,
        p.stock

    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
        AND o.status = 'completed'  -- chỉ tính đơn hoàn thành

    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 5;
END //

DELIMITER ;
CALL sp_top_selling_products();
-- 9 quản lý giới thiệu sản phẩm
DROP PROCEDURE IF EXISTS sp_add_product_showcase;
DELIMITER $$

CREATE PROCEDURE sp_add_product_showcase (
    IN p_product_id INT,
    IN p_title VARCHAR(255),
    IN p_short_description TEXT,
    IN p_banner_image_url TEXT,
    IN p_display_order INT,
    IN p_is_active BOOLEAN,
    IN p_created_by INT
)
BEGIN
    INSERT INTO product_showcases (
        product_id, title, short_description, banner_image_url,
        display_order, is_active, created_by, updated_by
    )
    VALUES (
        p_product_id, p_title, p_short_description, p_banner_image_url,
        p_display_order, p_is_active, p_created_by, p_created_by
    );

    SELECT ps.*, p.name AS product_name, p.brand, p.price, p.image_url AS product_image_url
    FROM product_showcases ps
    INNER JOIN products p ON p.id = ps.product_id
    WHERE ps.id = LAST_INSERT_ID();
END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_update_product_showcase;
DELIMITER $$

CREATE PROCEDURE sp_update_product_showcase (
    IN p_id INT,
    IN p_product_id INT,
    IN p_title VARCHAR(255),
    IN p_short_description TEXT,
    IN p_banner_image_url TEXT,
    IN p_display_order INT,
    IN p_is_active BOOLEAN,
    IN p_updated_by INT
)
BEGIN
    UPDATE product_showcases
    SET
        product_id = p_product_id,
        title = p_title,
        short_description = p_short_description,
        banner_image_url = p_banner_image_url,
        display_order = p_display_order,
        is_active = p_is_active,
        updated_by = p_updated_by,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'PRODUCT_SHOWCASE_NOT_FOUND' AS message;
    ELSE
        SELECT ps.*, p.name AS product_name, p.brand, p.price, p.image_url AS product_image_url
        FROM product_showcases ps
        INNER JOIN products p ON p.id = ps.product_id
        WHERE ps.id = p_id;
    END IF;
END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_delete_product_showcase;
DELIMITER $$

CREATE PROCEDURE sp_delete_product_showcase (
    IN p_id INT
)
BEGIN
    DELETE FROM product_showcases
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'PRODUCT_SHOWCASE_NOT_FOUND' AS message;
    ELSE
        SELECT 'DELETE_SUCCESS' AS message;
    END IF;
END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_get_all_product_showcases;
DELIMITER $$

CREATE PROCEDURE sp_get_all_product_showcases ()
BEGIN
    SELECT
        ps.*,
        p.name AS product_name,
        p.brand,
        p.price,
        p.stock,
        p.image_url AS product_image_url
    FROM product_showcases ps
    INNER JOIN products p ON p.id = ps.product_id
    ORDER BY ps.display_order ASC, ps.created_at DESC;
END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_get_product_showcase_by_id;
DELIMITER $$

CREATE PROCEDURE sp_get_product_showcase_by_id (
    IN p_id INT
)
BEGIN
    SELECT
        ps.*,
        p.name AS product_name,
        p.brand,
        p.price,
        p.stock,
        p.description AS product_description,
        p.image_url AS product_image_url
    FROM product_showcases ps
    INNER JOIN products p ON p.id = ps.product_id
    WHERE ps.id = p_id;
END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_get_public_product_showcases;
DELIMITER $$

CREATE PROCEDURE sp_get_public_product_showcases ()
BEGIN
    SELECT
        ps.id,
        ps.product_id,
        ps.title,
        ps.short_description,
        ps.banner_image_url,
        ps.display_order,
        p.name AS product_name,
        p.brand,
        p.price,
        p.image_url AS product_image_url
    FROM product_showcases ps
    INNER JOIN products p ON p.id = ps.product_id
    WHERE ps.is_active = TRUE
    ORDER BY ps.display_order ASC, ps.created_at DESC;
END $$

DELIMITER ;
-- 10 Thêm header
DROP PROCEDURE IF EXISTS sp_add_header;
DELIMITER $$

CREATE PROCEDURE sp_add_header (
    IN p_site_name VARCHAR(255),
    IN p_logo_url TEXT,
    IN p_hotline VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_address TEXT,
    IN p_banner_text VARCHAR(255),
    IN p_banner_image_url TEXT,
    IN p_is_active BOOLEAN
)
BEGIN
    IF p_is_active = TRUE THEN
        UPDATE headers
        SET is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP;
    END IF;

    INSERT INTO headers (
        site_name, logo_url, hotline, email, address,
        banner_text, banner_image_url, is_active
    )
    VALUES (
        p_site_name, p_logo_url, p_hotline, p_email, p_address,
        p_banner_text, p_banner_image_url, p_is_active
    );

    SELECT *
    FROM headers
    WHERE id = LAST_INSERT_ID();
END $$

DELIMITER ;
-- Cập nhật header
DROP PROCEDURE IF EXISTS sp_update_header;
DELIMITER $$

CREATE PROCEDURE sp_update_header (
    IN p_id INT,
    IN p_site_name VARCHAR(255),
    IN p_logo_url TEXT,
    IN p_hotline VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_address TEXT,
    IN p_banner_text VARCHAR(255),
    IN p_banner_image_url TEXT,
    IN p_is_active BOOLEAN
)
BEGIN
    IF p_is_active = TRUE THEN
        UPDATE headers
        SET is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id <> p_id;
    END IF;

    UPDATE headers
    SET
        site_name = p_site_name,
        logo_url = p_logo_url,
        hotline = p_hotline,
        email = p_email,
        address = p_address,
        banner_text = p_banner_text,
        banner_image_url = p_banner_image_url,
        is_active = p_is_active,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
        SELECT *
        FROM headers
        WHERE id = p_id;
    END IF;
END $$

DELIMITER ;
-- Xoá header
DROP PROCEDURE IF EXISTS sp_delete_header;
DELIMITER $$

CREATE PROCEDURE sp_delete_header (
    IN p_id INT
)
BEGIN
    DELETE FROM headers
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
        SELECT 'DELETE_SUCCESS' AS message;
    END IF;
END $$

DELIMITER ;
-- Lấy tất cả header
DROP PROCEDURE IF EXISTS sp_get_all_headers;
DELIMITER $$

CREATE PROCEDURE sp_get_all_headers ()
BEGIN
    SELECT * FROM headers
    ORDER BY updated_at DESC;
END $$

DELIMITER ;
-- Kích hoạt header
DROP PROCEDURE IF EXISTS sp_activate_header;
DELIMITER $$

CREATE PROCEDURE sp_activate_header (
    IN p_id INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM headers WHERE id = p_id) THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
    UPDATE headers
    SET is_active = FALSE;

    UPDATE headers
    SET is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    SELECT *
    FROM headers
    WHERE id = p_id;
    END IF;
END $$

DELIMITER ;
-- 11 Thêm menu
DROP PROCEDURE IF EXISTS sp_add_header_menu;
DELIMITER $$

CREATE PROCEDURE sp_add_header_menu (
    IN p_header_id INT,
    IN p_name VARCHAR(255),
    IN p_link VARCHAR(255),
    IN p_position INT,
    IN p_parent_id INT,
    IN p_is_active BOOLEAN
)
BEGIN
    INSERT INTO header_menus (
        header_id, name, link, position, parent_id, is_active
    )
    VALUES (
        p_header_id, p_name, p_link, p_position, p_parent_id, p_is_active
    );

    SELECT *
    FROM header_menus
    WHERE id = LAST_INSERT_ID();
END $$

DELIMITER ;
-- Cập nhật menu
DROP PROCEDURE IF EXISTS sp_update_header_menu;
DELIMITER $$

CREATE PROCEDURE sp_update_header_menu (
    IN p_id INT,
    IN p_header_id INT,
    IN p_name VARCHAR(255),
    IN p_link VARCHAR(255),
    IN p_position INT,
    IN p_parent_id INT,
    IN p_is_active BOOLEAN
)
BEGIN
    UPDATE header_menus
    SET
        header_id = p_header_id,
        name = p_name,
        link = p_link,
        position = p_position,
        parent_id = p_parent_id,
        is_active = p_is_active
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'HEADER_MENU_NOT_FOUND' AS message;
    ELSE
        SELECT *
        FROM header_menus
        WHERE id = p_id;
    END IF;
END $$

DELIMITER ;
-- Xoá Menu
DROP PROCEDURE IF EXISTS sp_delete_header_menu;
DELIMITER $$

CREATE PROCEDURE sp_delete_header_menu (
    IN p_id INT
)
BEGIN
    DELETE FROM header_menus
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'HEADER_MENU_NOT_FOUND' AS message;
    ELSE
        SELECT 'DELETE_SUCCESS' AS message;
    END IF;
END $$

DELIMITER ;
-- lấy menu theo header
DROP PROCEDURE IF EXISTS sp_get_menus_by_header;
DELIMITER $$

CREATE PROCEDURE sp_get_menus_by_header (
    IN p_header_id INT
)
BEGIN
    SELECT *
    FROM header_menus
    WHERE header_id = p_header_id
    ORDER BY position ASC, id ASC;
END $$

DELIMITER ;
-- Đổi trạng thái menu
DROP PROCEDURE IF EXISTS sp_toggle_header_menu_status;
DELIMITER $$

CREATE PROCEDURE sp_toggle_header_menu_status (
    IN p_id INT,
    IN p_is_active BOOLEAN
)
BEGIN
    UPDATE header_menus
    SET is_active = p_is_active
    WHERE id = p_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'HEADER_MENU_NOT_FOUND' AS message;
    ELSE
        SELECT *
        FROM header_menus
        WHERE id = p_id;
    END IF;
END $$

DELIMITER;
-- Test product showcases
CALL sp_add_product_showcase(
    1,
    'San pham gioi thieu test',
    'Mo ta ngan cho san pham gioi thieu',
    'https://example.com/banner-test.jpg',
    1,
    TRUE,
    1
);

CALL sp_update_product_showcase(
    1,
    1,
    'San pham gioi thieu test updated',
    'Mo ta ngan da cap nhat',
    'https://example.com/banner-test-updated.jpg',
    2,
    TRUE,
    1
);
--
CALL sp_get_all_headers();
CALL sp_add_header(
    'Doan3 Shop',
    'https://example.com/logo.png',
    '0909000000',
    'shop@example.com',
    '123 Le Loi, Q1',
    'Chao mung den voi cua hang',
    'https://example.com/banner.png',
    TRUE
);


DROP PROCEDURE IF EXISTS sp_add_header;
DELIMITER $$
CREATE PROCEDURE sp_add_header(
    IN p_site_name VARCHAR(255),
    IN p_logo_url TEXT,
    IN p_hotline VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_address TEXT,
    IN p_banner_text VARCHAR(255),
    IN p_banner_image_url TEXT,
    IN p_is_active BOOLEAN
)
BEGIN
    IF p_is_active = TRUE THEN
        UPDATE headers SET is_active = FALSE WHERE id > 0;
    END IF;

    INSERT INTO headers (
        site_name,
        logo_url,
        hotline,
        email,
        address,
        banner_text,
        banner_image_url,
        is_active
    )
    VALUES (
        p_site_name,
        p_logo_url,
        p_hotline,
        p_email,
        p_address,
        p_banner_text,
        p_banner_image_url,
        COALESCE(p_is_active, TRUE)
    );

    SELECT * FROM headers WHERE id = LAST_INSERT_ID();
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_get_all_headers;
DELIMITER $$ 
CREATE PROCEDURE sp_get_all_headers()
BEGIN
    SELECT *
    FROM headers
    ORDER BY is_active DESC, id DESC;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_get_header_by_id;
DELIMITER $$
CREATE PROCEDURE sp_get_header_by_id(
    IN p_id INT
)
BEGIN
    SELECT *
    FROM headers
    WHERE id = p_id
    LIMIT 1;
END $$
DELIMITER ;
--
DROP PROCEDURE IF EXISTS sp_update_header;
DELIMITER $$
CREATE PROCEDURE sp_update_header(
    IN p_id INT,
    IN p_site_name VARCHAR(255),
    IN p_logo_url TEXT,
    IN p_hotline VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_address TEXT,
    IN p_banner_text VARCHAR(255),
    IN p_banner_image_url TEXT,
    IN p_is_active BOOLEAN
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM headers WHERE id = p_id) THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
        IF p_is_active = TRUE THEN
            UPDATE headers
            SET is_active = FALSE
            WHERE id <> p_id;
        END IF;

        UPDATE headers
        SET
            site_name = p_site_name,
            logo_url = p_logo_url,
            hotline = p_hotline,
            email = p_email,
            address = p_address,
            banner_text = p_banner_text,
            banner_image_url = p_banner_image_url,
            is_active = COALESCE(p_is_active, is_active)
        WHERE id = p_id;

        SELECT *
        FROM headers
        WHERE id = p_id
        LIMIT 1;
    END IF;
END $$
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_delete_header;
-- 
DELIMITER $$
CREATE PROCEDURE sp_delete_header(
    IN p_id INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM headers WHERE id = p_id) THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
        DELETE FROM headers
        WHERE id = p_id;

        SELECT 'HEADER_DELETED' AS message;
    END IF;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_activate_header;
DELIMITER $$
CREATE PROCEDURE sp_activate_header(
    IN p_id INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM headers WHERE id = p_id) THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
        UPDATE headers
        SET is_active = FALSE WHERE id > 0;

        UPDATE headers
        SET is_active = TRUE
        WHERE id = p_id;

        SELECT *
        FROM headers
        WHERE id = p_id
        LIMIT 1;
    END IF;
END $$
DELIMITER ;



CALL sp_get_product_showcase_by_id(1);

CALL sp_get_all_product_showcases();

CALL sp_get_public_product_showcases();

CALL sp_delete_product_showcase(1);
