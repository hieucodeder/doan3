const db = require("../config/db");

// Tạo giỏ hàng cho user
const createCart = async (user_id) => {
    const [rows] = await db.query("CALL sp_create_cart(?)", [user_id]);
    return rows[0];
};

module.exports = { createCart };
