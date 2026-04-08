const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Lấy user theo email bằng sp_get_user_by_email
const getUserByEmail = async (email) => {
    const [rows] = await db.query(
        "CALL sp_get_user_by_email(?)",
        [email]
    );
    return rows[0][0] || null;
};

// Tạo JWT access token từ thông tin user
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

// Đăng nhập: lấy user theo email, so sánh password, trả về user + accessToken
const loginUser = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) return null;
    // Không trả password về client
    const { password: _, ...safeUser } = user;
    const accessToken = generateToken(safeUser);
    return { ...safeUser, accessToken };
};

// Gọi stored procedure đăng ký, trả về message từ SP
const registerUser = async (name, email, password, role) => {
    const [rows] = await db.query(
        "CALL sp_register_user(?, ?, ?, ?)",
        [name, email, password, role]
    );
    // SP trả về { message: 'REGISTER_SUCCESS' } hoặc { message: 'EMAIL_EXISTS' }
    return rows[0][0]?.message || null;
};

module.exports = { loginUser, registerUser };
