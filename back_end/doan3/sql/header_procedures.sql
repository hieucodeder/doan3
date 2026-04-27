DELIMITER //

DROP PROCEDURE IF EXISTS sp_add_header //
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
        UPDATE headers SET is_active = FALSE;
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
END //

DROP PROCEDURE IF EXISTS sp_get_all_headers //
CREATE PROCEDURE sp_get_all_headers()
BEGIN
    SELECT *
    FROM headers
    ORDER BY is_active DESC, id DESC;
END //

DROP PROCEDURE IF EXISTS sp_get_header_by_id //
CREATE PROCEDURE sp_get_header_by_id(
    IN p_id INT
)
BEGIN
    SELECT *
    FROM headers
    WHERE id = p_id
    LIMIT 1;
END //

DROP PROCEDURE IF EXISTS sp_update_header //
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
END //

DROP PROCEDURE IF EXISTS sp_delete_header //
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
END //

DROP PROCEDURE IF EXISTS sp_activate_header //
CREATE PROCEDURE sp_activate_header(
    IN p_id INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM headers WHERE id = p_id) THEN
        SELECT 'HEADER_NOT_FOUND' AS message;
    ELSE
        UPDATE headers
        SET is_active = FALSE;

        UPDATE headers
        SET is_active = TRUE
        WHERE id = p_id;

        SELECT *
        FROM headers
        WHERE id = p_id
        LIMIT 1;
    END IF;
END //

DELIMITER ;
