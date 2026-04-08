const db = require("../config/db");

// Tạo đánh giá sản phẩm
const createReview = async (user_id, product_id, rating, comment) => {
    const [rows] = await db.query(
        "CALL sp_create_review(?, ?, ?, ?)",
        [user_id, product_id, rating, comment]
    );
    return rows[0];
};

// Lấy danh sách đánh giá theo sản phẩm
const getReviewsByProduct = async (product_id) => {
    const [rows] = await db.query(
        "CALL sp_get_reviews_by_product(?)",
        [product_id]
    );
    return rows[0];
};

module.exports = { createReview, getReviewsByProduct };
