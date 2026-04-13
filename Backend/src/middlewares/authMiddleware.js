const jwt = require("jsonwebtoken");
require("dotenv").config();

// ==============================
// 🔐 Vérifier token JWT
// ==============================
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    // Format: Bearer TOKEN
    const cleanToken = token.split(" ")[1];

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};


// ==============================
// 👑 Vérifier rôle ADMIN
// ==============================
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès refusé (Admin seulement)" });
  }

  next();
};


// ==============================
// 👤 Vérifier CLIENT
// ==============================
exports.isClient = (req, res, next) => {
  if (req.user.role !== "CLIENT") {
    return res.status(403).json({ message: "Accès réservé aux clients" });
  }
  next();
};


// ==============================
// 🧑‍🔧 Vérifier PRESTATAIRE
// ==============================
exports.isPrestataire = (req, res, next) => {
  if (req.user.role !== "PRESTATAIRE") {
    return res.status(403).json({ message: "Accès réservé aux prestataires" });
  }
  next();
};