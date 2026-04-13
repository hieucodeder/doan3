const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/checkout", orderController.checkoutOrder);
router.get("/history/:orderId", orderController.getOrderHistoryByUser);
router.get("/user/:userId", orderController.getOrdersByUserWithStatus);
router.get("/:id/detail", orderController.getOrderDetail);
router.patch("/:id/cancel", orderController.cancelOrder);
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;
