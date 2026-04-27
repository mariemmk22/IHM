const normalizeRole = (role) => {
  if (!role) return undefined;
  const normalized = String(role).toLowerCase();

  if (normalized === "provider") {
    return "prestataire";
  }

  return normalized;
};

const checkRole = (...roles) => {
  const allowedRoles = roles.map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const userRole = normalizeRole(req.user.role);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Accès interdit",
      });
    }

    next();
  };
};

module.exports = checkRole;