const db = require("../config/db");

// Tạo danh mục mới
const createCategory = async (name, description) => {
    const [rows] = await db.query(
        "CALL sp_create_category(?, ?)",
        [name, description]
    );
    return rows[0];
};

// Lấy danh sách tất cả danh mục
const getCategories = async () => {
    const [rows] = await db.query("CALL sp_get_categories()");
    return rows[0];
};

// Xóa danh mục (SP kiểm tra nếu còn sản phẩm thì không cho xóa)
const deleteCategory = async (id) => {
    const [rows] = await db.query(
        "CALL sp_delete_category(?)",
        [id]
    );
    return rows[0][0]?.message || null;
};

module.exports = { createCategory, getCategories, deleteCategory };
