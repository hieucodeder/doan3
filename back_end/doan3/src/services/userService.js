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

module.exports = { createUser, getUsers };
