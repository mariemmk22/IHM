const { Document, Prestataire } = require("../models");

// Voir tous les documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        {
          model: Prestataire,
          as: "prestataire",
        },
      ],
    });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des documents",
      error: error.message,
    });
  }
};

// Voir document par id
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id, {
      include: [
        {
          model: Prestataire,
          as: "prestataire",
        },
      ],
    });

    if (!document) {
      return res.status(404).json({ message: "Document introuvable" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du document",
      error: error.message,
    });
  }
};

// Ajouter un document
exports.createDocument = async (req, res) => {
  try {
    const { fichier, prestataireId } = req.body;

    const prestataire = await Prestataire.findByPk(prestataireId);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    const document = await Document.create({
      fichier,
      prestataireId,
    });

    res.status(201).json({
      message: "Document ajouté avec succès",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du document",
      error: error.message,
    });
  }
};

// Vérifier document (admin)
exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ message: "Document introuvable" });
    }

    await document.update({ statut });

    res.status(200).json({
      message: "Statut du document mis à jour avec succès",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la vérification du document",
      error: error.message,
    });
  }
};

// Supprimer document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ message: "Document introuvable" });
    }

    await document.destroy();

    res.status(200).json({
      message: "Document supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du document",
      error: error.message,
    });
  }
};