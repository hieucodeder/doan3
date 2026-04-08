const db = require("../config/db");

// Thêm sản phẩm vào giỏ hàng (SP tự tạo cart nếu chưa có)
const addToCart = async (user_id, product_id, quantity) => {
    const [rows] = await db.query(
        "CALL sp_add_to_cart(?, ?, ?)",
        [user_id, product_id, quantity]
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

// Xóa sản phẩm khỏi giỏ hàng theo user_id và product_id
const removeCartItem = async (user_id, product_id) => {
    const [rows] = await db.query(
        "CALL sp_remove_cart_item(?, ?)",
        [user_id, product_id]
    );
    return rows[0];
};

// Cập nhật số lượng sản phẩm trong giỏ (nếu quantity <= 0 thì SP tự xóa)
const updateCartItemQuantity = async (user_id, product_id, quantity) => {
    const [rows] = await db.query(
        "CALL sp_update_cart_item_quantity(?, ?, ?)",
        [user_id, product_id, quantity]
    );
    return rows[0];
};

module.exports = { addToCart, getCartItems, removeCartItem, updateCartItemQuantity };
