const categoryService = require("../services/categoryService");

// POST /api/categories - Tạo danh mục mới
const createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "name là bắt buộc" });
    }

    try {
        const data = await categoryService.createCategory(name, description);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/categories - Lấy danh sách danh mục
const getCategories = async (req, res) => {
    try {
        const data = await categoryService.getCategories();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createCategory, getCategories };
