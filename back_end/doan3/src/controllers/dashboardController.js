const dashboardService = require("../services/dashboardService");

// GET /api/dashboard/summary - Tổng quan dashboard
const getDashboardSummary = async (req, res) => {
    try {
        const data = await dashboardService.getDashboardSummary();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/dashboard/top-products - Top 5 sản phẩm bán chạy
const getTopSellingProducts = async (req, res) => {
    try {
        const data = await dashboardService.getTopSellingProducts();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getDashboardSummary, getTopSellingProducts };
