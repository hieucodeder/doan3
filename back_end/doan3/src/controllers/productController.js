const productService = require("../services/productService");

// POST /api/products - Tạo sản phẩm mới
const createProduct = async (req, res) => {
    const { name, brand, price, stock, description, image_url, category_id } = req.body;

    if (!name || !brand || price == null) {
        return res.status(400).json({ success: false, message: "name, brand và price là bắt buộc" });
    }

    try {
        const data = await productService.createProduct(name, brand, price, stock, description, image_url, category_id);
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

// PUT /api/products/:id - Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, brand, price, stock, description, image_url, category_id } = req.body;

    if (!name || !brand || price == null) {
        return res.status(400).json({ success: false, message: "name, brand và price là bắt buộc" });
    }

    try {
        const data = await productService.updateProduct(id, name, brand, price, stock, description, image_url, category_id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/products/:id - Lấy chi tiết sản phẩm
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
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createProduct, getProducts, updateProduct, getProductById, searchProducts, deleteProduct };
