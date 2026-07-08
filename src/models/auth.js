const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, through: { attributes: [] } }],
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur introuvable' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};
