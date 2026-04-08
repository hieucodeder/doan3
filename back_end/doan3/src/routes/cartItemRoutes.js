const express = require("express");
const router = express.Router();
const cartItemController = require("../controllers/cartItemController");

router.post("/", cartItemController.addToCart);
router.get("/:userId", cartItemController.getCartItems);

module.exports = router;
