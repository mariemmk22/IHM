const { Service, Prestataire, SousCategorie } = require("../models");

// Voir tous les services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        {
          model: Prestataire,
          as: "prestataire",
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
        },
      ],
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des services",
      error: error.message,
    });
  }
};

// Voir un service par id
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id, {
      include: [
        {
          model: Prestataire,
          as: "prestataire",
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
        },
      ],
    });

    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du service",
      error: error.message,
    });
  }
};

// Ajouter un service
exports.createService = async (req, res) => {
  try {
    const { nomService, description, region, prix, prestataireId, sousCategorieId } = req.body;

    const prestataire = await Prestataire.findByPk(prestataireId);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    const sousCategorie = await SousCategorie.findByPk(sousCategorieId);
    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie introuvable" });
    }

    const service = await Service.create({
      nomService,
      description,
      region,
      prix,
      prestataireId,
      sousCategorieId,
    });

    res.status(201).json({
      message: "Service ajouté avec succès",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du service",
      error: error.message,
    });
  }
};

// Modifier un service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomService, description, region, prix, sousCategorieId } = req.body;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    await service.update({
      nomService,
      description,
      region,
      prix,
      sousCategorieId,
    });

    res.status(200).json({
      message: "Service modifié avec succès",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification du service",
      error: error.message,
    });
  }
};
// Supprimer un service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    await service.destroy();

    res.status(200).json({
      message: "Service supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du service",
      error: error.message,
    });
  }
};

// Rechercher un service
exports.searchServices = async (req, res) => {
  try {
    const { region, nomService } = req.query;
    const { Op } = require("sequelize");

    const whereClause = {};

    if (region) {
      whereClause.region = {
        [Op.like]: `%${region}%`,
      };
    }

    if (nomService) {
      whereClause.nomService = {
        [Op.like]: `%${nomService}%`,
      };
    }

    const services = await Service.findAll({
      where: whereClause,
      include: [
        {
          model: Prestataire,
          as: "prestataire",
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
        },
      ],
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recherche des services",
      error: error.message,
    });
  }
};