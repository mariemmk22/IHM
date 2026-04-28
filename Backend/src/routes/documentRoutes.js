const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
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

// Route download AVANT /:id pour éviter le conflit
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Fichier introuvable" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Erreur téléchargement:", err);
      res.status(500).json({ message: "Erreur lors du téléchargement" });
    }
  });
});

router.get("/:id", documentController.getDocumentById);
router.post("/", verifyToken, roleMiddleware("prestataire"), documentController.createDocument);
router.put("/:id/verify", documentController.verifyDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;