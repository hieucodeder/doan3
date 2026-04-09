const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/search", productController.searchProducts);
router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);

module.exports = router;
