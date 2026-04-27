const express = require("express");
const router = express.Router();
const headerController = require("../controllers/headerController");

router.post("/", headerController.createHeader);
router.get("/", headerController.getHeaders);
router.get("/:id", headerController.getHeaderById);
router.put("/:id", headerController.updateHeader);
router.delete("/:id", headerController.deleteHeader);
router.patch("/:id/activate", headerController.activateHeader);

module.exports = router;
