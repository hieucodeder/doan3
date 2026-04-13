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

// POST /api/orders/checkout - Đặt hàng từ giỏ hàng
const checkoutOrder = async (req, res) => {
    const { user_id, address, phone, name } = req.body;

    if (!user_id || !address || !phone || !name) {
        return res.status(400).json({ success: false, message: "user_id, address, phone, name là bắt buộc" });
    }

    try {
        const result = await orderService.checkoutOrder(user_id, address, phone, name);

        if (!result || result.message === "CART_EMPTY") {
            return res.status(400).json({ success: false, message: "Giỏ hàng trống" });
        }

        if (result.message === "OUT_OF_STOCK") {
            return res.status(400).json({ success: false, message: "Một hoặc nhiều sản phẩm không đủ hàng" });
        }

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: { order_id: result.order_id }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders/history/:orderId - Chi tiết sản phẩm trong đơn hàng
const getOrderHistoryByUser = async (req, res) => {
    const { orderId } = req.params;

    try {
        const data = await orderService.getOrderHistoryByUser(orderId);
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders/:id/detail - Chi tiết đơn hàng
const getOrderDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await orderService.getOrderDetail(id);
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/orders/:id/cancel - Huỷ đơn hàng
const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: "user_id là bắt buộc" });
    }

    try {
        const message = await orderService.cancelOrder(id, user_id);

        if (message === "ORDER_NOT_FOUND") {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }

        if (message === "CANNOT_CANCEL") {
            return res.status(400).json({ success: false, message: "Đơn hàng không thể huỷ (chỉ huỷ được khi đang pending)" });
        }

        res.json({ success: true, message: "Huỷ đơn hàng thành công" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders/user/:userId?status=pending - Danh sách đơn theo user và trạng thái
const getOrdersByUserWithStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, message: "userId là bắt buộc" });
    }

    try {
        const data = await orderService.getOrdersByUserWithStatus(userId, status || null);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus, checkoutOrder, getOrderHistoryByUser, getOrderDetail, cancelOrder, getOrdersByUserWithStatus };
