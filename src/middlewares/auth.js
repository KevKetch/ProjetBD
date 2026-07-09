const jwt = require('jsonwebtoken');
const { User, Role, Admin } = require('../models');
const { checkRole, blockFondateur } = require('./role');

const TYPE_TO_ROLE = {
  1: 'fondateur',
  2: 'directeur',
  3: 'admin',
  4: 'enseignant',
  5: 'parent',
};

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    if (decoded.type === 'admin') {
      // Token généré depuis le modèle Admin
      const admin = await Admin.findByPk(decoded.id).catch(() => null);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Utilisateur introuvable' });
      }
      const roleName = decoded.role || TYPE_TO_ROLE[admin.typeAdmin] || 'admin';
      // Simuler la structure Roles attendue par checkRole et blockFondateur
      req.user = {
        ...admin.toJSON(),
        Roles: [{ name: roleName }],
      };
    } else {
      // Token généré depuis le modèle User (avec Roles association)
      const user = await User.findByPk(decoded.id, {
        include: [{ model: Role, through: { attributes: [] } }],
      }).catch(() => null);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Utilisateur introuvable' });
      }
      // Si la relation Role n'est pas encore peuplée, on utilise typeAdmin
      if (!user.Roles || user.Roles.length === 0) {
        const roleName = TYPE_TO_ROLE[user.typeAdmin] || 'directeur';
        user.Roles = [{ name: roleName }];
      }
      req.user = user;
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// Re-export role helpers so routes can import from this file
exports.checkRole = checkRole;
exports.blockFondateur = blockFondateur;

