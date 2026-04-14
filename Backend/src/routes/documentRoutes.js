const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);
router.post("/", documentController.createDocument);
router.put("/:id/verify", documentController.verifyDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;