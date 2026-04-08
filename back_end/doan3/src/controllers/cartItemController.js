const cartItemService = require("../services/cartItemService");

// POST /api/cart-items - Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || !quantity) {
        return res.status(400).json({ success: false, message: "cart_id, product_id, quantity là bắt buộc" });
    }

    try {
        const data = await cartItemService.addToCart(cart_id, product_id, quantity);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/cart-items/:userId - Lấy giỏ hàng của user
const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const data = await cartItemService.getCartItems(userId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { addToCart, getCartItems };
