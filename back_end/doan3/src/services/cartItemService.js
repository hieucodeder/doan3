const db = require("../config/db");

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (cart_id, product_id, quantity) => {
    const [rows] = await db.query(
        "CALL sp_add_to_cart(?, ?, ?)",
        [cart_id, product_id, quantity]
    );
    return rows[0];
};

// Lấy danh sách sản phẩm trong giỏ hàng theo user_id
const getCartItems = async (user_id) => {
    const [rows] = await db.query(
        "CALL sp_get_cart_items(?)",
        [user_id]
    );
    return rows[0];
};

module.exports = { addToCart, getCartItems };
