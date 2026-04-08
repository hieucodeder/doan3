const cartItemService = require("../services/cartItemService");

// POST /api/cart-items - Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ success: false, message: "user_id, product_id, quantity là bắt buộc" });
    }

    try {
        const data = await cartItemService.addToCart(user_id, product_id, quantity);
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

// DELETE /api/cart-items - Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({ success: false, message: "user_id và product_id là bắt buộc" });
    }

    try {
        await cartItemService.removeCartItem(user_id, product_id);
        res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/cart-items - Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || quantity == null) {
        return res.status(400).json({ success: false, message: "user_id, product_id, quantity là bắt buộc" });
    }

    try {
        await cartItemService.updateCartItemQuantity(user_id, product_id, quantity);
        const message = quantity <= 0
            ? "Đã xóa sản phẩm khỏi giỏ hàng"
            : "Đã cập nhật số lượng";
        res.json({ success: true, message });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { addToCart, getCartItems, removeCartItem, updateCartItemQuantity };
