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

module.exports = { createUser, getUsers };
