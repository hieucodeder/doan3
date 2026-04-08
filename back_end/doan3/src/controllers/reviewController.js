const reviewService = require("../services/reviewService");

// POST /api/reviews - Tạo đánh giá sản phẩm
const createReview = async (req, res) => {
    const { user_id, product_id, rating, comment } = req.body;

    if (!user_id || !product_id || rating == null) {
        return res.status(400).json({ success: false, message: "user_id, product_id, rating là bắt buộc" });
    }

    try {
        const data = await reviewService.createReview(user_id, product_id, rating, comment);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/reviews/:productId - Lấy đánh giá theo sản phẩm
const getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const data = await reviewService.getReviewsByProduct(productId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createReview, getReviewsByProduct };
