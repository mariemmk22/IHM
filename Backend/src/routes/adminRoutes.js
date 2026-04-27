const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ==============================
// USERS
// ==============================
router.get("/users", adminController.getAllUsers);

// ==============================
// BLOQUER
// ==============================
router.patch("/clients/:id/block", adminController.blockClient);
router.patch("/prestataires/:id/block", adminController.blockPrestataire);

// ==============================
// ACTIVER PRESTATAIRE
// ==============================
router.patch("/prestataires/:id/activate", adminController.activatePrestataire);

// ==============================
// DOCUMENTS
// ==============================
router.get("/documents/pending", adminController.getPendingDocuments);
router.patch("/documents/:id/accept", adminController.acceptDocument);
router.patch("/documents/:id/reject", adminController.rejectDocument);

// ==============================
// SERVICES
// ==============================
router.get("/services", adminController.getAllServices);

// ==============================
// CATEGORIES
// ==============================
router.post("/categories", adminController.createCategorie);
router.put("/categories/:id", adminController.updateCategorie);
router.delete("/categories/:id", adminController.deleteCategorie);

module.exports = router;