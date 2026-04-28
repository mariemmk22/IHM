const express = require("express");
const router = express.Router();

const avisController = require("../controllers/avisController");
const { verifyToken } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", avisController.getAllAvis);
router.get("/service/:serviceId", avisController.getByService);
router.get("/me", verifyToken, avisController.getMine);
router.get("/client/:clientId", avisController.getByClient);
router.get("/prestataire/:prestataireId", avisController.getByPrestataire);

router.post("/", verifyToken, roleMiddleware("client"), avisController.createAvis);
router.delete("/:id", verifyToken, roleMiddleware("admin"), avisController.deleteAvis);

module.exports = router;
