const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware xác thực JWT access token
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // Header phải có dạng: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Không có access token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // lưu thông tin user vào request để dùng ở controller
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Access token không hợp lệ hoặc đã hết hạn" });
    }
};

module.exports = { authenticate };
