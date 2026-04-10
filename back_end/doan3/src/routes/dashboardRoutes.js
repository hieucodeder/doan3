const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/summary", dashboardController.getDashboardSummary);
router.get("/top-products", dashboardController.getTopSellingProducts);

module.exports = router;
