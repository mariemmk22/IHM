const { Service, Prestataire, SousCategorie, Client } = require("../models");

const formatPrestataire = (prestataire, fallbackClient) => {
  if (!prestataire) return undefined;

  return {
    id: prestataire.id,
    nom: prestataire.client?.nom ?? fallbackClient?.nom ?? `Prestataire #${prestataire.id}`,
    prenom: prestataire.client?.prenom ?? fallbackClient?.prenom ?? "",
    specialite: prestataire.specialite,
    disponibilite: prestataire.disponibilite,
  };
};

const normalizeService = (service, fallbackClient) => ({
  id: service.idService,
  nomService: service.nomService,
  description: service.description,
  region: service.region,
  prix: service.prix,
  prestataire: formatPrestataire(service.prestataire, fallbackClient),
  sousCategorie: service.sousCategorie
    ? {
        id: service.sousCategorie.idSousCategorie,
        nom: service.sousCategorie.nomSousCategorie,
      }
    : undefined,
});

const normalizeServicesWithProviderNames = async (services) => {
  const missingProviderIds = [...new Set(
    services
      .filter((service) => service.prestataire && !service.prestataire.client?.nom)
      .map((service) => service.prestataire.id),
  )];

  const fallbackClientByPrestataireId = new Map();

  if (missingProviderIds.length > 0) {
    const fallbackPrestataires = await Prestataire.findAll({
      where: { id: missingProviderIds },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "nom", "prenom", "email"],
        },
      ],
    });

    fallbackPrestataires.forEach((prestataire) => {
      fallbackClientByPrestataireId.set(prestataire.id, prestataire.client ?? null);
    });
  }

  return services.map((service) => normalizeService(service, fallbackClientByPrestataireId.get(service.prestataire?.id) ?? null));
};

// DEBUG: Get services by prestataire ID
exports.getServicesByPrestataire = async (req, res) => {
  try {
    const { prestataireId } = req.params;
    const services = await Service.findAll({
      where: { prestataireId: Number(prestataireId) },
      include: [
        {
          model: Prestataire,
          as: "prestataire",
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "nom", "prenom", "email"],
            },
          ],
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const normalized = await normalizeServicesWithProviderNames(services);
    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des services", error: error.message });
  }
};

// Voir tous les services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        {
          model: Prestataire,
          as: "prestataire",
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "nom", "prenom", "email"],
            },
          ],
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
        },
      ],
    });

    const normalizedServices = await normalizeServicesWithProviderNames(services);

    res.status(200).json(normalizedServices);
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
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "nom", "prenom", "email"],
            },
          ],
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

    const [normalizedService] = await normalizeServicesWithProviderNames([service]);

    res.status(200).json(normalizedService);
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

    console.log("Creating service:", { nomService, description, region, prix, prestataireId, sousCategorieId });
    console.log("User from token:", req.user);

    // Validate required fields
    if (!prestataireId) {
      return res.status(400).json({ message: "ID prestataire requis" });
    }

    // Verify user can only create services for their own prestataire
    if (req.user && req.user.prestataireId && String(req.user.prestataireId) !== String(prestataireId)) {
      console.log("Prestataire ID mismatch:", { tokenId: req.user.prestataireId, bodyId: prestataireId });
      return res.status(403).json({ 
        message: "Vous ne pouvez créer des services que pour votre propre profil",
        tokenPrestataireId: req.user.prestataireId,
        bodyPrestataireId: prestataireId
      });
    }

    const prestataire = await Prestataire.findByPk(Number(prestataireId));
    console.log("Prestataire found:", prestataire?.id, prestataire?.specialite);
    
    if (!prestataire) {
      return res.status(404).json({ 
        message: "Prestataire introuvable",
        prestataireId: prestataireId,
        available: "Vérifiez que votre profil prestataire est correctement enregistré"
      });
    }

    // Find SousCategorie using idSousCategorie (the primary key)
    const sousCategorie = await SousCategorie.findByPk(Number(sousCategorieId));
    console.log("SousCategorie found:", sousCategorie?.idSousCategorie, sousCategorie?.nomSousCategorie);
    
    if (!sousCategorie) {
      console.log("SousCategorie not found with ID:", sousCategorieId);
      // Try to find all sous categories to help debug
      const allSubCats = await SousCategorie.findAll({ attributes: ['idSousCategorie', 'nomSousCategorie'] });
      console.log("Available sous categories:", allSubCats.map(s => ({ id: s.idSousCategorie, nom: s.nomSousCategorie })));
      
      return res.status(404).json({ 
        message: "Sous-catégorie introuvable",
        sousCategorieId: sousCategorieId,
        availableSousCategories: allSubCats.map(s => ({ id: s.idSousCategorie, nom: s.nomSousCategorie }))
      });
    }

    const service = await Service.create({
      nomService,
      description,
      region,
      prix,
      prestataireId: Number(prestataireId),
      sousCategorieId: Number(sousCategorieId),
    });

    console.log("Service created:", service.idService);

    res.status(201).json({
      message: "Service ajouté avec succès",
      service: {
        id: service.idService,
        nomService: service.nomService,
        description: service.description,
        region: service.region,
        prix: service.prix,
        prestataireId: service.prestataireId,
        sousCategorieId: service.sousCategorieId,
      },
    });
  } catch (error) {
    console.error("Error creating service:", error);
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

    const service = await Service.findByPk(Number(id));

    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    if (sousCategorieId) {
      const sousCategorie = await SousCategorie.findByPk(Number(sousCategorieId));
      if (!sousCategorie) {
        return res.status(404).json({ message: "Sous-catégorie introuvable" });
      }
    }

    await service.update({
      nomService,
      description,
      region,
      prix,
      sousCategorieId: sousCategorieId ? Number(sousCategorieId) : undefined,
    });

    res.status(200).json({
      message: "Service modifié avec succès",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
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

    const service = await Service.findByPk(Number(id));

    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    await service.destroy();

    res.status(200).json({
      message: "Service supprimé avec succès",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
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
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "nom", "prenom", "email"],
            },
          ],
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
        },
      ],
    });

    const normalizedServices = await normalizeServicesWithProviderNames(services);

    res.status(200).json(normalizedServices);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recherche des services",
      error: error.message,
    });
  }
};