const authService = require("../services/authService");

// POST /api/auth/register - Đăng ký tài khoản
const register = async (req, res) => {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "name, email, password là bắt buộc" });
    }

    try {
        const message = await authService.registerUser(name, email, password, role);

        if (message === "EMAIL_EXISTS") {
            return res.status(409).json({ success: false, message: "Email đã được sử dụng" });
        }

        res.status(201).json({ success: true, message: "Đăng ký thành công" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/login - Đăng nhập
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "email và password là bắt buộc" });
    }

    try {
        const user = await authService.loginUser(email, password);

        if (!user) {
            return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { register, login };
