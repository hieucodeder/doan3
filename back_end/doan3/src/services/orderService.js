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

// Đặt hàng: tự tính tổng tiền, tạo order, thêm order_items và xóa giỏ hàng
const checkoutOrder = async (user_id, address, phone) => {
    const [rows] = await db.query(
        "CALL sp_checkout_order(?, ?, ?)",
        [user_id, address, phone]
    );
    // SP trả về { message: 'ORDER_SUCCESS', order_id } hoặc { message: 'CART_EMPTY' }
    return rows[0][0] || null;
};

// Lấy lịch sử đặt hàng của user
const getOrderHistoryByUser = async (user_id) => {
    const [rows] = await db.query(
        "CALL sp_get_order_history_by_user(?)",
        [user_id]
    );
    return rows[0];
};

// Lấy chi tiết đơn hàng theo order_id
const getOrderDetail = async (order_id) => {
    const [rows] = await db.query(
        "CALL sp_get_order_detail(?)",
        [order_id]
    );
    return rows[0];
};

// Huỷ đơn hàng (chỉ được huỷ khi đơn ở trạng thái pending)
const cancelOrder = async (order_id, user_id) => {
    const [rows] = await db.query(
        "CALL sp_cancel_order_by_user(?, ?)",
        [order_id, user_id]
    );
    return rows[0][0]?.message || null;
};

// Lấy danh sách đơn theo user, có thể lọc theo trạng thái
const getOrdersByUserWithStatus = async (user_id, status = null) => {
    const [rows] = await db.query(
        "CALL sp_get_orders_by_user_with_status(?, ?)",
        [user_id, status]
    );
    return rows[0];
};

module.exports = { createOrder, getOrders, updateOrderStatus, checkoutOrder, getOrderHistoryByUser, getOrderDetail, cancelOrder, getOrdersByUserWithStatus };
