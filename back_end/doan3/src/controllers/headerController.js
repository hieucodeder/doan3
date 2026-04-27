const headerService = require("../services/headerService");

// POST /api/headers - Tạo header mới
const createHeader = async (req, res) => {
    const {
        site_name,
        logo_url,
        hotline,
        email,
        address,
        banner_text,
        banner_image_url,
        is_active
    } = req.body;

    if (!site_name) {
        return res.status(400).json({ success: false, message: "site_name là bắt buộc" });
    }

    try {
        const data = await headerService.createHeader(
            site_name,
            logo_url || "",
            hotline || "",
            email || "",
            address || "",
            banner_text || "",
            banner_image_url || "",
            is_active !== false
        );

        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/headers - Lấy danh sách header
const getHeaders = async (req, res) => {
    try {
        const data = await headerService.getHeaders();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/headers/:id - Lấy chi tiết header
const getHeaderById = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await headerService.getHeaderById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: "Header không tồn tại" });
        }

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/headers/:id - Cập nhật header
const updateHeader = async (req, res) => {
    const { id } = req.params;
    const {
        site_name,
        logo_url,
        hotline,
        email,
        address,
        banner_text,
        banner_image_url,
        is_active
    } = req.body;

    if (!site_name) {
        return res.status(400).json({ success: false, message: "site_name là bắt buộc" });
    }

    try {
        const data = await headerService.updateHeader(
            id,
            site_name,
            logo_url || "",
            hotline || "",
            email || "",
            address || "",
            banner_text || "",
            banner_image_url || "",
            is_active !== false
        );

        if (data?.message === "HEADER_NOT_FOUND") {
            return res.status(404).json({ success: false, message: "Header không tồn tại" });
        }

        res.json({
            success: true,
            message: "Cập nhật header thành công",
            data
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/headers/:id - Xóa header
const deleteHeader = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await headerService.deleteHeader(id);

        if (data?.message === "HEADER_NOT_FOUND") {
            return res.status(404).json({ success: false, message: "Header không tồn tại" });
        }

        res.json({ success: true, message: "Xóa header thành công" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/headers/:id/activate - Kích hoạt header
const activateHeader = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await headerService.activateHeader(id);

        if (data?.message === "HEADER_NOT_FOUND") {
            return res.status(404).json({ success: false, message: "Header không tồn tại" });
        }

        res.json({
            success: true,
            message: "Kích hoạt header thành công"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createHeader,
    getHeaders,
    getHeaderById,
    updateHeader,
    deleteHeader,
    activateHeader
};
