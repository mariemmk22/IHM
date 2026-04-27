const {
  Client,
  Prestataire,
  Document,
  Service,
  Categorie,
} = require("../models");


// ==============================
// 🔍 Consulter tous les utilisateurs
// ==============================
exports.getAllUsers = async (req, res) => {
  try {
    const clients = await Client.findAll();
    const prestataires = await Prestataire.findAll();

    res.json({ clients, prestataires });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// 🔒 Bloquer un client
// ==============================
exports.blockClient = async (req, res) => {
  try {
    const { id } = req.params;

    await Client.update(
      { statutCompte: "bloque" },
      { where: { id } }
    );

    res.json({ message: "Client bloqué" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// 🔒 Bloquer un prestataire
// ==============================
exports.blockPrestataire = async (req, res) => {
  try {
    const { id } = req.params;

    await Prestataire.update(
      { statutCompte: "bloque" },
      { where: { id } }
    );

    res.json({ message: "Prestataire bloqué" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// ✅ Activer prestataire
// ==============================
exports.activatePrestataire = async (req, res) => {
  try {
    const { id } = req.params;

    await Prestataire.update(
      { statutCompte: "actif" },
      { where: { id } }
    );

    res.json({ message: "Prestataire activé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// 📄 Voir documents en attente
// ==============================
exports.getPendingDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { statut: "en_attente" },
      include: "prestataire",
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// ✅ Accepter document
// ==============================
exports.acceptDocument = async (req, res) => {
  try {
    const { id } = req.params;

    await Document.update(
      { statut: "accepte" },
      { where: { idDocument: id } }
    );

    res.json({ message: "Document accepté" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// ❌ Refuser document
// ==============================
exports.rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;

    await Document.update(
      { statut: "refuse" },
      { where: { idDocument: id } }
    );

    res.json({ message: "Document refusé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// 📊 Consulter services
// ==============================
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: ["prestataire"],
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// 📂 Ajouter catégorie
// ==============================
exports.createCategorie = async (req, res) => {
  try {
    const { nomCategorie, description } = req.body;

    const cat = await Categorie.create({
      nomCategorie,
      description,
    });

    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// ✏️ Modifier catégorie
// ==============================
exports.updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    await Categorie.update(req.body, {
      where: { idCategorie: id },
    });

    res.json({ message: "Catégorie modifiée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// 🗑️ Supprimer catégorie
// ==============================
exports.deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    await Categorie.destroy({
      where: { idCategorie: id },
    });

    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};