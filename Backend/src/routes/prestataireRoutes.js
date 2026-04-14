const express = require("express");
const router = express.Router();
const prestataireController = require("../controllers/prestataireController");

router.get("/", prestataireController.getAllPrestataires);
router.get("/:id", prestataireController.getPrestataireById);
router.post("/", prestataireController.createPrestataire);
router.put("/:id", prestataireController.updatePrestataire);
router.patch("/:id/disponibilite", prestataireController.updateDisponibilite);
router.delete("/:id", prestataireController.deletePrestataire);

module.exports = router;