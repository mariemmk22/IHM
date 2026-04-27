const { SousCategorie, Categorie, Service } = require("../models");

exports.createSousCategorie = async (req, res) => {
  try {
    const { nomSousCategorie, description, categorieId } = req.body;

    const categorie = await Categorie.findByPk(categorieId);

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    const sousCategorie = await SousCategorie.create({
      nomSousCategorie,
      description,
      categorieId,
    });

    res.status(201).json({
      message: "Sous-catégorie ajoutée avec succès",
      sousCategorie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la sous-catégorie",
      error: error.message,
    });
  }
};

exports.getAllSousCategories = async (req, res) => {
  try {
    const sousCategories = await SousCategorie.findAll({
      include: [
        { model: Categorie, as: "categorie" },
        { model: Service, as: "services" },
      ],
    });

    res.status(200).json(sousCategories);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des sous-catégories",
      error: error.message,
    });
  }
};

exports.getSousCategorieById = async (req, res) => {
  try {
    const { id } = req.params;

    const sousCategorie = await SousCategorie.findByPk(id, {
      include: [
        { model: Categorie, as: "categorie" },
        { model: Service, as: "services" },
      ],
    });

    if (!sousCategorie) {
      return res.status(404).json({
        message: "Sous-catégorie introuvable",
      });
    }

    res.status(200).json(sousCategorie);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la sous-catégorie",
      error: error.message,
    });
  }
};

exports.updateSousCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomSousCategorie, description, categorieId } = req.body;

    const sousCategorie = await SousCategorie.findByPk(id);

    if (!sousCategorie) {
      return res.status(404).json({
        message: "Sous-catégorie introuvable",
      });
    }

    await sousCategorie.update({
      nomSousCategorie,
      description,
      categorieId,
    });

    res.status(200).json({
      message: "Sous-catégorie modifiée avec succès",
      sousCategorie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification de la sous-catégorie",
      error: error.message,
    });
  }
};

exports.deleteSousCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const sousCategorie = await SousCategorie.findByPk(id);

    if (!sousCategorie) {
      return res.status(404).json({
        message: "Sous-catégorie introuvable",
      });
    }

    await sousCategorie.destroy();

    res.status(200).json({
      message: "Sous-catégorie supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la sous-catégorie",
      error: error.message,
    });
  }
};