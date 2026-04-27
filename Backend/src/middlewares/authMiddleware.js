const jwt = require("jsonwebtoken");
require("dotenv").config();

// ==============================
// 🔐 Vérifier token JWT
// ==============================
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Token missing or invalid format");
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", { id: decoded.id, role: decoded.role, prestataireId: decoded.prestataireId });

    req.user = decoded; // { id, role, prestataireId }

    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ message: "Token invalide" });
  }
};

// ==============================
// 👑 Vérifier rôle ADMIN
// ==============================
const isAdmin = (req, res, next) => {
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
const isClient = (req, res, next) => {
  if (!req.user || req.user.role !== "CLIENT") {
    return res.status(403).json({ message: "Accès réservé aux clients" });
  }
  next();
};

// ==============================
// 🧑‍🔧 Vérifier PRESTATAIRE
// ==============================
const isPrestataire = (req, res, next) => {
  if (!req.user || req.user.role !== "PRESTATAIRE") {
    return res.status(403).json({ message: "Accès réservé aux prestataires" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isClient,
  isPrestataire,
};