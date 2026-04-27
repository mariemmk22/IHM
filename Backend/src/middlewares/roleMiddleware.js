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
      console.log("User not authenticated in role middleware");
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const userRole = normalizeRole(req.user.role);
    console.log("Role check:", { userRole, allowedRoles, userObj: req.user });

    if (!allowedRoles.includes(userRole)) {
      console.log("Role not allowed:", { userRole, allowedRoles });
      return res.status(403).json({
        message: "Accès interdit",
      });
    }

    next();
  };
};

module.exports = checkRole;