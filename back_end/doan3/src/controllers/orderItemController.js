const orderItemService = require("../services/orderItemService");

// POST /api/order-items - Thêm sản phẩm vào đơn hàng
const addOrderItem = async (req, res) => {
    const { order_id, product_id, quantity, price } = req.body;

    if (!order_id || !product_id || !quantity || price == null) {
        return res.status(400).json({ success: false, message: "order_id, product_id, quantity, price là bắt buộc" });
    }

    try {
        const data = await orderItemService.addOrderItem(order_id, product_id, quantity, price);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { addOrderItem };
