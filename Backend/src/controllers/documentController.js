const { Document, Prestataire, Client } = require("../models");

// Voir documents d'un prestataire
exports.getDocumentsByPrestataire = async (req, res) => {
  try {
    const { prestataireId } = req.params;

    if (!req.user || req.user.role !== "prestataire" || String(req.user.prestataireId) !== String(prestataireId)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const documents = await Document.findAll({
      where: { prestataireId: Number(prestataireId) },
      order: [["dateDepot", "DESC"]],
    });

    const normalized = documents.map((doc) => ({
      id: doc.idDocument,
      fichier: doc.fichier,
      dateDepot: doc.dateDepot,
      statut: doc.statut,
      prestataireId: doc.prestataireId,
    }));

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des documents du prestataire",
      error: error.message,
    });
  }
};

// Voir tous les documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        {
          model: Prestataire,
          as: "prestataire",
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "nom", "prenom", "email", "telephone", "region"],
            },
          ],
        },
      ],
      order: [["dateDepot", "DESC"]],
    });

    const normalized = documents.map((doc) => ({
      id: doc.idDocument,
      fichier: doc.fichier,
      dateDepot: doc.dateDepot,
      statut: doc.statut,
      prestataireId: doc.prestataireId,
      prestataire: doc.prestataire ? {
        id: doc.prestataire.id,
        specialite: doc.prestataire.specialite,
        client: doc.prestataire.client ?? null,
      } : null,
    }));

    res.status(200).json(normalized);
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

// Ajouter un document (upload CV via multer)
exports.createDocument = async (req, res) => {
  try {
    const { prestataireId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (!prestataireId) {
      return res.status(400).json({ message: "prestataireId manquant" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    // Autoriser : prestataire confirmé OU client en_attente avec prestataireId correspondant
    const tokenPrestataireId = String(req.user.prestataireId ?? "");
    const bodyPrestataireId  = String(prestataireId);

    if (tokenPrestataireId !== bodyPrestataireId) {
      return res.status(403).json({ message: "Accès refusé : prestataire ID ne correspond pas" });
    }

    const prestataire = await Prestataire.findByPk(prestataireId);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    const document = await Document.create({
      fichier: req.file.filename,
      prestataireId,
    });

    res.status(201).json({
      message: "Document ajouté avec succès",
      document: {
        id: document.idDocument,
        fichier: document.fichier,
        dateDepot: document.dateDepot,
        statut: document.statut,
        prestataireId: document.prestataireId,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du document",
      error: error.message,
    });
  }
};

// Vérifier document (admin) — accepter change le rôle en prestataire
exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!["accepte", "refuse"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: "Document introuvable" });
    }

    await document.update({ statut });

    // Mettre à jour le compte client selon la décision
    const prestataire = await Prestataire.findByPk(document.prestataireId);
    if (prestataire) {
      const client = await Client.findByPk(prestataire.clientId);
      if (client) {
        if (statut === "accepte") {
          // Accepté → rôle devient prestataire, compte actif
          await client.update({ role: "prestataire", statutCompte: "actif" });
        } else {
          // Refusé → reste client, compte inactif
          await client.update({ statutCompte: "inactif" });
        }
      }
    }

    res.status(200).json({
      message: statut === "accepte"
        ? "Document accepté — compte prestataire activé"
        : "Document refusé",
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