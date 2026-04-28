const { Categorie, SousCategorie } = require("../models");

// ==============================
// Ajouter une catégorie
// ==============================
exports.createCategorie = async (req, res) => {
  try {
    const { nomCategorie, description } = req.body;

    const categorie = await Categorie.create({
      nomCategorie,
      description,
    });

    res.status(201).json({
      message: "Catégorie ajoutée avec succès",
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la catégorie",
      error: error.message,
    });
  }
};

// ==============================
// Afficher toutes les catégories
// ==============================
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      include: [
        {
          model: SousCategorie,
          as: "sousCategories",
        },
      ],
    });

    // Normalize the response to use 'id' instead of 'idCategorie'/'idSousCategorie'
    const normalizedCategories = categories.map(cat => ({
      id: cat.idCategorie,
      nomCategorie: cat.nomCategorie,
      description: cat.description,
      sousCategories: cat.sousCategories?.map(sc => ({
        id: sc.idSousCategorie,
        nomSousCategorie: sc.nomSousCategorie,
        description: sc.description,
        categorieId: sc.categorieId,
      })) ?? []
    }));

    res.status(200).json(normalizedCategories);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catégories",
      error: error.message,
    });
  }
};

// ==============================
// Afficher une catégorie par id
// ==============================
exports.getCategorieById = async (req, res) => {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findByPk(id, {
      include: [
        {
          model: SousCategorie,
          as: "sousCategories",
        },
      ],
    });

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    // Normalize the response
    const normalizedCategorie = {
      id: categorie.idCategorie,
      nomCategorie: categorie.nomCategorie,
      description: categorie.description,
      sousCategories: categorie.sousCategories?.map(sc => ({
        id: sc.idSousCategorie,
        nomSousCategorie: sc.nomSousCategorie,
        description: sc.description,
        categorieId: sc.categorieId,
      })) ?? []
    };

    res.status(200).json(normalizedCategorie);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la catégorie",
      error: error.message,
    });
  }
};

// ==============================
// Modifier une catégorie
// ==============================
exports.updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomCategorie, description } = req.body;

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    await categorie.update({
      nomCategorie,
      description,
    });

    res.status(200).json({
      message: "Catégorie modifiée avec succès",
      categorie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification de la catégorie",
      error: error.message,
    });
  }
};

// ==============================
// Supprimer une catégorie
// ==============================
exports.deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    await categorie.destroy();

    res.status(200).json({
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la catégorie",
      error: error.message,
    });
  }
};