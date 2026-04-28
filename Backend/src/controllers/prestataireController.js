const { Prestataire, Client, Service, Document } = require("../models");
const generateToken = require("../utils/generateToken");

// Voir profil prestataire
exports.getPrestataireById = async (req, res) => {
  try {
    const { id } = req.params;

    const prestataire = await Prestataire.findByPk(id, {
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "nom", "prenom", "email", "telephone", "region", "adresse", "statutCompte"],
        },
        {
          model: Service,
          as: "services",
        },
        {
          model: Document,
          as: "documents",
        },
      ],
    });

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    res.status(200).json(prestataire);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du prestataire",
      error: error.message,
    });
  }
};

// Voir tous les prestataires
exports.getAllPrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.findAll({
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "nom", "prenom", "email", "telephone", "region", "adresse", "statutCompte"],
        },
      ],
    });

    res.status(200).json(prestataires);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des prestataires",
      error: error.message,
    });
  }
};

// Ajouter un prestataire
exports.createPrestataire = async (req, res) => {
  try {
    const { clientId, specialite, description, disponibilite } = req.body;

    const existingPrestataire = await Prestataire.findOne({
      where: { clientId },
    });

    if (existingPrestataire) {
      return res.status(400).json({
        message: "Ce client est déjà enregistré comme prestataire",
      });
    }

    const prestataire = await Prestataire.create({
      clientId,
      specialite,
      description,
      disponibilite,
    });

    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        message: "Client introuvable pour générer le token prestataire",
      });
    }

    // Mettre le compte en attente — le rôle reste "client" jusqu'à validation admin
    await client.update({ statutCompte: "en_attente" });

    // Créer un Document initial pour la validation admin
    await Document.create({
      prestataireId: prestataire.id,
      fichier: "en_attente", // Placeholder - sera remplacé par le CV uploadé
      statut: "en_attente",
    });

    const token = generateToken({
      id: client.id,
      prestataireId: prestataire.id,
      role: "client",           // reste client jusqu'à acceptation
      email: client.email,
      statutCompte: "en_attente",
    });

    res.status(201).json({
      message: "Profil prestataire créé. En attente de validation du CV par l'administrateur.",
      token,
      user: {
        id: client.id,
        prestataireId: prestataire.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: "client",
        statutCompte: "en_attente",
      },
      prestataire,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du prestataire",
      error: error.message,
    });
  }
};

// Modifier prestataire
exports.updatePrestataire = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialite, description, disponibilite } = req.body;

    const prestataire = await Prestataire.findByPk(id);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    await prestataire.update({
      specialite,
      description,
      disponibilite,
    });

    res.status(200).json({
      message: "Prestataire mis à jour avec succès",
      prestataire,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification du prestataire",
      error: error.message,
    });
  }
};

// Modifier seulement le statut de disponibilité
exports.updateDisponibilite = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponibilite } = req.body;

    const prestataire = await Prestataire.findByPk(id);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    await prestataire.update({ disponibilite });

    res.status(200).json({
      message: "Disponibilité mise à jour avec succès",
      prestataire,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la disponibilité",
      error: error.message,
    });
  }
};

// Supprimer prestataire
exports.deletePrestataire = async (req, res) => {
  try {
    const { id } = req.params;

    const prestataire = await Prestataire.findByPk(id);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    await prestataire.destroy();

    res.status(200).json({
      message: "Prestataire supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du prestataire",
      error: error.message,
    });
  }
};