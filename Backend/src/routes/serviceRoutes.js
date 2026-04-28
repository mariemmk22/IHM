const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/serviceController");
const { verifyToken } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/prestataire/:prestataireId", serviceController.getServicesByPrestataire);
router.get("/debug/by-prestataire/:prestataireId", serviceController.getServicesByPrestataire);

router.get("/", serviceController.getAllServices);
router.get("/search", serviceController.searchServices);
router.get("/:id", serviceController.getServiceById);

router.post("/", verifyToken, roleMiddleware("prestataire"), serviceController.createService);
router.put("/:id", verifyToken, roleMiddleware("prestataire"), serviceController.updateService);
router.delete("/:id", verifyToken, roleMiddleware("prestataire"), serviceController.deleteService);

module.exports = router;