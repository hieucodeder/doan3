const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.put("/email", userController.updateUserByEmail);
router.patch("/:id/status", userController.toggleUserStatus);

module.exports = router;
