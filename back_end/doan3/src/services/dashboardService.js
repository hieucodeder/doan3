const db = require("../config/db");

// Lấy tổng quan dashboard: doanh thu, đơn hàng, sản phẩm
const getDashboardSummary = async () => {
    const [rows] = await db.query("CALL sp_dashboard_summary()");
    return rows[0][0];
};

// Lấy top 5 sản phẩm bán chạy nhất
const getTopSellingProducts = async () => {
    const [rows] = await db.query("CALL sp_top_selling_products()");
    return rows[0];
};

module.exports = { getDashboardSummary, getTopSellingProducts };
