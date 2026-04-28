const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const documentController = require("../controllers/documentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cv-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

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
  
  // Chemin absolu depuis la racine du projet Backend
  const filePath = path.join(__dirname, "../../../uploads", filename);
  const filePath2 = path.join(__dirname, "../../uploads", filename);

  const resolvedPath = fs.existsSync(filePath) ? filePath : fs.existsSync(filePath2) ? filePath2 : null;

  if (!resolvedPath) {
    console.log("Fichier introuvable:", filePath, "ou", filePath2);
    return res.status(404).json({ message: "Fichier introuvable" });
  }

  res.download(resolvedPath, filename, (err) => {
    if (err) {
      console.error("Erreur téléchargement:", err);
      res.status(500).json({ message: "Erreur lors du téléchargement" });
    }
  });
});

router.get("/:id", documentController.getDocumentById);
router.post("/", verifyToken, roleMiddleware("prestataire"), upload.single("fichier"), documentController.createDocument);
router.put("/:id/verify", documentController.verifyDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;