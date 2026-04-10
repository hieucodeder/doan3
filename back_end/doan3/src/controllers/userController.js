const userService = require("../services/userService");

// POST /api/users - Tạo user mới
const createUser = async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "name, email, password là bắt buộc" });
    }

    try {
        const data = await userService.createUser(name, email, password, phone, address);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/users - Lấy danh sách user
const getUsers = async (req, res) => {
    try {
        const data = await userService.getUsers();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/users/:id/status - Bật/tắt trạng thái user
const toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ success: false, message: "status phải là 0 (khóa) hoặc 1 (mở)" });
    }

    try {
        await userService.toggleUserStatus(id, status);
        const message = status === 1 ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản";
        res.json({ success: true, message });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/email - Cập nhật thông tin user theo email
const updateUserByEmail = async (req, res) => {
    const { email, name, new_email } = req.body;

    if (!email || !name || !new_email) {
        return res.status(400).json({ success: false, message: "email, name, new_email là bắt buộc" });
    }

    try {
        await userService.updateUserByEmail(email, name, new_email);
        res.json({ success: true, message: "Cập nhật thông tin thành công" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createUser, getUsers, toggleUserStatus, updateUserByEmail };
