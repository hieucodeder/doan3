const productService = require("../services/productService");

// POST /api/products - Tạo sản phẩm mới
const createProduct = async (req, res) => {
    const { name, brand, price, stock, description, category_id, image_url, images = [] } = req.body;

    if (!name || !brand || price == null || !category_id) {
        return res.status(400).json({ success: false, message: "name, brand, price, category_id là bắt buộc" });
    }

    try {
        const data = await productService.createProduct(name, brand, price, stock, description, category_id, image_url, images);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/products - Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
    try {
        const data = await productService.getProducts();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/products/:id - Cập nhật sản phẩm (chỉ cần ít nhất 1 trường)
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, brand, price, stock, description, category_id } = req.body;

    if (!name && !brand && price == null && stock == null && !description && category_id == null) {
        return res.status(400).json({ success: false, message: "Cần ít nhất 1 trường để cập nhật" });
    }

    const parsedCategoryId = category_id != null ? Number(category_id) : null;
    if (parsedCategoryId !== null && (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0)) {
        return res.status(400).json({ success: false, message: "category_id không hợp lệ" });
    }

    try {
        const data = await productService.updateProduct(
            id,
            name ?? null,
            brand ?? null,
            price ?? null,
            stock ?? null,
            description ?? null,
            parsedCategoryId
        );
        res.json({ success: true, data });
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ success: false, message: "category_id không tồn tại" });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/products/:id/images - Thêm ảnh cho sản phẩm
const addProductImage = async (req, res) => {
    const { id } = req.params;
    const { image_url, images } = req.body;

    if (!image_url && (!Array.isArray(images) || images.length === 0)) {
        return res.status(400).json({ success: false, message: "image_url hoặc images là bắt buộc" });
    }

    try {
        if (Array.isArray(images) && images.length > 0) {
            for (const url of images) {
                if (!url) continue;
                await productService.addProductImage(id, url);
            }
        } else {
            await productService.addProductImage(id, image_url);
        }

        res.status(201).json({ success: true, message: "Thêm ảnh sản phẩm thành công" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /:id - Lấy chi tiết sản phẩm
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await productService.getProductById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/products/search?keyword=Dior&category_id=0
const searchProducts = async (req, res) => {
    const { keyword = "", category_id = 0 } = req.query;

    try {
        const data = await productService.searchProducts(keyword, category_id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/products/:id - Xóa sản phẩm
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await productService.deleteProduct(id);

        if (message === "PRODUCT_IN_ORDER") {
            return res.status(400).json({ success: false, message: "Sản phẩm đã có trong đơn hàng, không thể xóa" });
        }

        res.json({ success: true, message: "Xóa sản phẩm thành công" });
    } catch (err) {
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).json({ success: false, message: "Sản phẩm đang liên kết dữ liệu khác, không thể xóa" });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createProduct, getProducts, updateProduct, getProductById, searchProducts, deleteProduct, addProductImage };
