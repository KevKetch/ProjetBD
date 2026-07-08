exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.Roles.map(r => r.name);
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    next();
  };
};

// Middleware pour bloquer le Fondateur sur les modules opérationnels
exports.blockFondateur = (req, res, next) => {
  const userRoles = req.user.Roles.map(r => r.name);
  if (userRoles.includes('fondateur')) {
    return res.status(403).json({ success: false, message: 'Le Fondateur n\'a pas accès à ce module' });
  }
  next();
};
