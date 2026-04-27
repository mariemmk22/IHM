const express = require("express");
const router = express.Router();
const sousCategorieController = require("../controllers/sousCategorieController");

router.post("/", sousCategorieController.createSousCategorie);
router.get("/", sousCategorieController.getAllSousCategories);
router.get("/:id", sousCategorieController.getSousCategorieById);
router.put("/:id", sousCategorieController.updateSousCategorie);
router.delete("/:id", sousCategorieController.deleteSousCategorie);

module.exports = router;