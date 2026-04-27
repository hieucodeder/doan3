const db = require("../config/db");

// Tạo header mới
const createHeader = async (
    siteName,
    logoUrl,
    hotline,
    email,
    address,
    bannerText,
    bannerImageUrl,
    isActive
) => {
    const [rows] = await db.query(
        "CALL sp_add_header(?, ?, ?, ?, ?, ?, ?, ?)",
        [siteName, logoUrl, hotline, email, address, bannerText, bannerImageUrl, isActive]
    );

    return rows[0]?.[0] || rows[0] || null;
};

// Lấy danh sách header
const getHeaders = async () => {
    const [rows] = await db.query("CALL sp_get_all_headers()");
    return rows[0] || [];
};

// Lấy chi tiết header theo id
const getHeaderById = async (id) => {
    const [rows] = await db.query(
        "CALL sp_get_header_by_id(?)",
        [id]
    );

    return rows[0]?.[0] || null;
};

// Cập nhật header
const updateHeader = async (
    id,
    siteName,
    logoUrl,
    hotline,
    email,
    address,
    bannerText,
    bannerImageUrl,
    isActive
) => {
    const [rows] = await db.query(
        "CALL sp_update_header(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id, siteName, logoUrl, hotline, email, address, bannerText, bannerImageUrl, isActive]
    );

    return rows[0]?.[0] || rows[0] || null;
};

// Xóa header
const deleteHeader = async (id) => {
    const [rows] = await db.query(
        "CALL sp_delete_header(?)",
        [id]
    );

    return rows[0]?.[0] || rows[0] || null;
};

// Kích hoạt header và tắt các header khác
const activateHeader = async (id) => {
    const [rows] = await db.query(
        "CALL sp_activate_header(?)",
        [id]
    );

    return rows[0]?.[0] || rows[0] || null;
};

module.exports = {
    createHeader,
    getHeaders,
    getHeaderById,
    updateHeader,
    deleteHeader,
    activateHeader
};
