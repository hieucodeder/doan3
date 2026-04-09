const db = require("../config/db");

// Tạo sản phẩm mới
const createProduct = async (name, description, price, stock, category_id, image_url) => {
    const [rows] = await db.query(
        "CALL sp_create_product(?, ?, ?, ?, ?, ?)",
        [name, description, price, stock, category_id, image_url]
    );
    return rows[0];
};

// Lấy danh sách tất cả sản phẩm
const getProducts = async () => {
    const [rows] = await db.query("CALL sp_get_products()");
    return rows[0];
};

// Cập nhật thông tin sản phẩm theo id
const updateProduct = async (id, name, description, price, stock, category_id, image_url) => {
    const [rows] = await db.query(
        "CALL sp_update_product(?, ?, ?, ?, ?, ?, ?)",
        [id, name, description, price, stock, category_id, image_url]
    );
    return rows[0];
};

// Lấy chi tiết sản phẩm theo id (kèm tên danh mục)
const getProductById = async (id) => {
    const [rows] = await db.query(
        "CALL sp_get_product_by_id(?)",
        [id]
    );
    return rows[0][0] || null;
};

// Tìm kiếm sản phẩm theo keyword và category_id (0 = tất cả)
const searchProducts = async (keyword = "", category_id = 0) => {
    const [rows] = await db.query(
        "CALL sp_search_products(?, ?)",
        [keyword, category_id]
    );
    return rows[0];
};

module.exports = { createProduct, getProducts, updateProduct, getProductById, searchProducts };
