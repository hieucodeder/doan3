const db = require("../config/db");

// Thêm sản phẩm vào đơn hàng
const addOrderItem = async (order_id, product_id, quantity, price) => {
    const [rows] = await db.query(
        "CALL sp_add_order_item(?, ?, ?, ?)",
        [order_id, product_id, quantity, price]
    );
    return rows[0];
};

module.exports = { addOrderItem };
