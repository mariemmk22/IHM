const { Client } = require("../models");

// 🔹 Créer un client
exports.createClient = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      motDePasse,
      telephone,
      region,
      adresse,
      statutCompte,
    } = req.body;

    // Vérifier email existant
    const existingClient = await Client.findOne({ where: { email } });

    if (existingClient) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const client = await Client.create({
      nom,
      prenom,
      email,
      motDePasse,
      telephone,
      region,
      adresse,
      statutCompte,
    });

    res.status(201).json({
      message: "Client créé avec succès",
      client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du client",
      error: error.message,
    });
  }
};

// 🔹 Voir tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des clients",
      error: error.message,
    });
  }
};

// 🔹 Voir client par ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du client",
      error: error.message,
    });
  }
};

// 🔹 Modifier client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    await client.update(req.body);

    res.status(200).json({
      message: "Client modifié avec succès",
      client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification du client",
      error: error.message,
    });
  }
};

// 🔹 Supprimer client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    await client.destroy();

    res.status(200).json({
      message: "Client supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du client",
      error: error.message,
    });
  }
};