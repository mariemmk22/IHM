const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", serviceController.getAllServices);
router.get("/search", serviceController.searchServices);
router.get("/:id", serviceController.getServiceById);

router.post("/", authMiddleware, roleMiddleware("prestataire"), serviceController.createService);
router.put("/:id", authMiddleware, roleMiddleware("prestataire"), serviceController.updateService);
router.delete("/:id", authMiddleware, roleMiddleware("prestataire"), serviceController.deleteService);

module.exports = router;