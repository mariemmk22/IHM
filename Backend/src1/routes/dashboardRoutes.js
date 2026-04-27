const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/provider/:id", verifyToken, roleMiddleware("prestataire"), dashboardController.getProviderDashboard);
router.get("/client/:id", verifyToken, roleMiddleware("client"), dashboardController.getClientDashboard);

module.exports = router;
