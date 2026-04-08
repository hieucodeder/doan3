const db = require("../config/db");

// Tạo đơn hàng mới
const createOrder = async (user_id, total_price, shipping_address) => {
    const [rows] = await db.query(
        "CALL sp_create_order(?, ?, ?)",
        [user_id, total_price, shipping_address]
    );
    return rows[0];
};

// Lấy danh sách tất cả đơn hàng
const getOrders = async () => {
    const [rows] = await db.query("CALL sp_get_orders()");
    return rows[0];
};

// Cập nhật trạng thái đơn hàng theo id
const updateOrderStatus = async (id, status) => {
    const [rows] = await db.query(
        "CALL sp_update_order_status(?, ?)",
        [id, status]
    );
    return rows[0];
};

module.exports = { createOrder, getOrders, updateOrderStatus };
