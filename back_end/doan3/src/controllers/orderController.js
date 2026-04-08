const orderService = require("../services/orderService");

// POST /api/orders - Tạo đơn hàng mới
const createOrder = async (req, res) => {
    const { user_id, total_price, shipping_address } = req.body;

    if (!user_id || total_price == null) {
        return res.status(400).json({ success: false, message: "user_id và total_price là bắt buộc" });
    }

    try {
        const data = await orderService.createOrder(user_id, total_price, shipping_address);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders - Lấy danh sách đơn hàng
const getOrders = async (req, res) => {
    try {
        const data = await orderService.getOrders();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: "status là bắt buộc" });
    }

    try {
        const data = await orderService.updateOrderStatus(id, status);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
