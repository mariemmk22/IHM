const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
	"/prestataire/:prestataireId",
	verifyToken,
	roleMiddleware("prestataire"),
	documentController.getDocumentsByPrestataire,
);

router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);
router.post("/", verifyToken, roleMiddleware("prestataire"), documentController.createDocument);
router.put("/:id/verify", documentController.verifyDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;