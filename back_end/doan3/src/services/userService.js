const db = require("../config/db");

// Tạo user mới bằng stored procedure sp_create_user
const createUser = async (name, email, password, phone, address) => {
    const [rows] = await db.query(
        "CALL sp_create_user(?, ?, ?, ?, ?)",
        [name, email, password, phone, address]
    );
    return rows[0];
};

// Lấy danh sách tất cả user
const getUsers = async () => {
    const [rows] = await db.query("CALL sp_get_users()");
    return rows[0];
};

// Bật/tắt trạng thái user (1: hoạt động, 0: vô hiệu hoá)
const toggleUserStatus = async (id, status) => {
    const [rows] = await db.query(
        "CALL sp_toggle_user_status(?, ?)",
        [id, status]
    );
    return rows[0];
};

// Cập nhật thông tin user theo email
const updateUserByEmail = async (email, name, new_email) => {
    const [rows] = await db.query(
        "CALL sp_update_user_by_email(?, ?, ?)",
        [email, name, new_email]
    );
    return rows[0];
};

module.exports = { createUser, getUsers, toggleUserStatus, updateUserByEmail };
