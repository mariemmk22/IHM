const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register-client", authController.registerClient);
router.post("/register-prestataire", authController.registerPrestataire);
router.post("/login", authController.login);
router.post("/login-admin", authController.loginAdmin);
router.get("/me", verifyToken, authController.getMe);

module.exports = router;