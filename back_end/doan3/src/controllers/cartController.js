const cartService = require("../services/cartService");

// POST /api/cart - Tạo giỏ hàng mới
const createCart = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: "user_id là bắt buộc" });
    }

    try {
        const data = await cartService.createCart(user_id);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createCart };
