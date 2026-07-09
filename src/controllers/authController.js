const jwt = require('jsonwebtoken');
const { Admin, User, Role } = require('../models');

/**
 * Mapping typeAdmin (integer) → nom de rôle frontend
 * 1 = fondateur, 2 = directeur, 3 = admin, 4 = enseignant, 5 = parent
 */
const TYPE_TO_ROLE = {
  1: 'fondateur',
  2: 'directeur',
  3: 'admin',
  4: 'enseignant',
  5: 'parent',
};

/**
 * POST /auth/login
 * Accepte { email, password } OU { email, motDePasse }
 * Essaie Admin (username=email), puis User (email)
 */
exports.login = async (req, res) => {
  try {
    const { email, password, motDePasse } = req.body;
    const pwd = password || motDePasse;

    if (!email || !pwd) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    // 1️⃣ Essai via le modèle Admin (username = email, password bcrypt)
    const admin = await Admin.findOne({ where: { username: email } }).catch(() => null);
    if (admin) {
      const match = await admin.comparePassword(pwd).catch(() => false);
      if (match) {
        const role = TYPE_TO_ROLE[admin.typeAdmin] || 'admin';
        const token = jwt.sign(
          { id: admin.ID, type: 'admin', role },
          process.env.JWT_SECRET || 'dev_secret',
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          token,
          user: {
            id: `admin-${admin.ID}`,
            nom: admin.nom,
            prenom: '',
            email: admin.username,
            role,
            actif: !!admin.actif,
          },
        });
      }
    }

    // 2️⃣ Essai via le modèle User (email, password bcrypt + Roles association)
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, through: { attributes: [] } }],
    }).catch(() => null);

    if (user) {
      const match = await user.comparePassword(pwd).catch(() => false);
      if (match) {
        const roles = (user.Roles || []).map((r) => r.name);
        const primaryRole = roles[0] || TYPE_TO_ROLE[user.typeAdmin] || 'directeur';
        const token = jwt.sign(
          { id: user.id, type: 'user', role: primaryRole },
          process.env.JWT_SECRET || 'dev_secret',
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          token,
          user: {
            id: `user-${user.id}`,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: primaryRole,
            actif: !!user.actif,
          },
        });
      }
    }

    // 3️⃣ Aucun utilisateur trouvé
    return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  } catch (err) {
    console.error('[authController.login]', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /auth/me
 * Retourne l'utilisateur actuellement connecté (à partir du token)
 */
exports.me = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.updateProfile = async (req, res) => {
  const bcrypt = require('bcryptjs');
  try {
    const { prenom, nom, telephone, motDePasse } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    if (req.user.ID) {
      const admin = await Admin.findByPk(req.user.ID);
      if (!admin) return res.status(404).json({ success: false, message: 'Profil introuvable' });
      
      const updates = {};
      if (nom !== undefined || prenom !== undefined) {
        updates.nom = `${prenom || ''} ${nom || ''}`.trim();
      }
      if (telephone !== undefined) updates.mobile = telephone;
      if (motDePasse) updates.password = await bcrypt.hash(motDePasse, 10);

      await admin.update(updates);
      return res.json({ success: true, message: 'Profil mis à jour' });
    } else if (req.user.id) {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'Profil introuvable' });

      const updates = {};
      if (nom !== undefined) updates.nom = nom;
      if (prenom !== undefined) updates.prenom = prenom;
      if (motDePasse) updates.password = await bcrypt.hash(motDePasse, 10);

      await user.update(updates);
      return res.json({ success: true, message: 'Profil mis à jour' });
    }

    return res.status(400).json({ success: false, message: 'Type utilisateur non géré' });
  } catch (err) {
    console.error('[authController.updateProfile]', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};
