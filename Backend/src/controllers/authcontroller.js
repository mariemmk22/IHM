const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { Client, Prestataire, Admin } = require("../models");




// Register client
exports.registerClient = async (req, res) => {
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

    const existingClient = await Client.findOne({ where: { email } });

    if (existingClient) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const client = await Client.create({
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      telephone,
      region,
      adresse,
      statutCompte: statutCompte || "actif",
    });

    const token = generateToken({
      id: client.id,
      role: "client",
      email: client.email,
    });

    res.status(201).json({
      message: "Client créé avec succès",
      token,
      user: {
        id: client.id,
        prestataireId: null,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: "client",
        region: client.region ?? undefined,
        telephone: client.telephone ?? undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'inscription client",
      error: error.message,
    });
  }
};

// Register prestataire
exports.registerPrestataire = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      motDePasse,
      telephone,
      region,
      adresse,
      specialite,
      description,
      disponibilite,
    } = req.body;

    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const client = await Client.create({
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      telephone,
      region,
      adresse,
      statutCompte: "actif",
    });

    const prestataire = await Prestataire.create({
      clientId: client.id,
      specialite,
      description,
      disponibilite: disponibilite ?? true,
    });

    const token = generateToken({
      id: client.id,
      prestataireId: prestataire.id,
      role: "prestataire",
      email: client.email,
    });

    res.status(201).json({
      message: "Prestataire créé avec succès",
      token,
      user: {
        id: client.id,
        prestataireId: String(prestataire.id),
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: "prestataire",
        specialite: prestataire.specialite,
        region: client.region ?? undefined,
        telephone: client.telephone ?? undefined,
        description: prestataire.description ?? undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'inscription prestataire",
      error: error.message,
    });
  }
};

// Login client ou prestataire
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // 1) chercher client / prestataire
    const client = await Client.findOne({
      where: { email },
      include: [
        {
          model: Prestataire,
          as: "prestataire",
          required: false,
        },
      ],
    });

    if (client) {
      let isMatch = false;

      if (client.motDePasse.startsWith("$2a$") || client.motDePasse.startsWith("$2b$")) {
        isMatch = await bcrypt.compare(motDePasse, client.motDePasse);
      } else {
        isMatch = motDePasse === client.motDePasse;
      }

      if (!isMatch) {
        return res.status(400).json({
          message: "Mot de passe incorrect",
        });
      }

      let role = "client";
      let prestataireId = null;

      if (client.prestataire) {
        role = "prestataire";
        prestataireId = client.prestataire.id;
      }

      const token = generateToken({
        id: client.id,
        prestataireId,
        role,
        email: client.email,
      });

      return res.status(200).json({
        message: "Connexion réussie",
        token,
        user: {
          id: client.id,
          prestataireId: prestataireId ? String(prestataireId) : null,
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          role,
          specialite: client.prestataire?.specialite ?? undefined,
          region: client.region ?? undefined,
          telephone: client.telephone ?? undefined,
          description: client.prestataire?.description ?? undefined,
        },
      });
    }

    // 2) chercher admin
    const admin = await Admin.findOne({ where: { email } });

    if (admin) {
      let isMatch = false;

      if (admin.motDePasse.startsWith("$2a$") || admin.motDePasse.startsWith("$2b$")) {
        isMatch = await bcrypt.compare(motDePasse, admin.motDePasse);
      } else {
        isMatch = motDePasse === admin.motDePasse;
      }

      if (!isMatch) {
        return res.status(400).json({
          message: "Mot de passe incorrect",
        });
      }

      const token = generateToken({
        id: admin.id,
        role: "admin",
        email: admin.email,
      });

      return res.status(200).json({
        message: "Connexion admin réussie",
        token,
        user: {
          id: admin.id,
          nom: admin.nom,
          prenom: "",
          email: admin.email,
          role: "admin",
        },
      });
    }

    return res.status(404).json({
      message: "Utilisateur introuvable",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};

// Get current user profile (refresh token)
exports.getMe = async (req, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const client = await Client.findByPk(clientId, {
      include: [
        {
          model: Prestataire,
          as: "prestataire",
          required: false,
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const role = client.role || "client";
    const prestataireId = client.prestataire?.id ?? null;

    const token = generateToken({
      id: client.id,
      prestataireId,
      role,
      email: client.email,
      statutCompte: client.statutCompte,
    });

    return res.status(200).json({
      token,
      user: {
        id: client.id,
        prestataireId: prestataireId ? String(prestataireId) : null,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role,
        statutCompte: client.statutCompte,
        specialite: client.prestataire?.specialite ?? undefined,
        region: client.region ?? undefined,
        telephone: client.telephone ?? undefined,
        description: client.prestataire?.description ?? undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({
        message: "Admin introuvable",
      });
    }

    const isMatch = await bcrypt.compare(motDePasse, admin.motDePasse);

    if (!isMatch) {
      return res.status(400).json({
        message: "Mot de passe incorrect",
      });
    }

    const token = generateToken({
      id: admin.id,
      role: "admin",
      email: admin.email,
    });

    res.status(200).json({
      message: "Connexion admin réussie",
      token,
      user: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion admin",
      error: error.message,
    });
  }
};