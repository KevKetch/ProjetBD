const { Enseignant, User, Role, sequelize } = require('../models');

const TYPE_TO_ROLE = {
  1: 'fondateur',
  2: 'directeur',
  3: 'admin',
  4: 'enseignant',
  5: 'parent',
};

function shape(enseignant) {
  const json = enseignant.toJSON();
  const user = json.User;
  delete json.User;
  return {
    ...json,
    nom: user?.nom || null,
    prenom: user?.prenom || null,
    email: user?.email || null,
  };
}

/**
 * GET /api/v1/enseignants
 * Liste tous les enseignants
 */
exports.listEnseignants = async (req, res) => {
  try {
    const { search, actif } = req.query;
    const where = {};
    if (actif !== undefined) where.actif = actif === 'true' ? 1 : 0;

    const enseignants = await Enseignant.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'nom', 'prenom', 'email'] }],
      order: [[User, 'nom', 'ASC']],
    });

    let result = enseignants.map(shape);

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((e) =>
        (e.nom || '').toLowerCase().includes(term) ||
        (e.prenom || '').toLowerCase().includes(term) ||
        (e.matricule || '').toString().toLowerCase().includes(term) ||
        (e.email || '').toLowerCase().includes(term)
      );
    }

    res.json(result);
  } catch (err) {
    console.error('[enseignantController.listEnseignants]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /api/v1/enseignants/:id
 * Détail d'un enseignant
 */
exports.getEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'nom', 'prenom', 'email'] }],
    });
    if (!enseignant) {
      return res.status(404).json({ success: false, message: 'Enseignant non trouvé' });
    }
    res.json(shape(enseignant));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * POST /api/v1/enseignants
 * Crée un enseignant : un compte User (rôle "enseignant") + un profil Enseignant.
 * Body: { nom, prenom, email, password, matricule, specialite, telephone }
 */
exports.createEnseignant = async (req, res) => {
  const { nom, prenom, email, password, matricule, specialite, telephone } = req.body;

  if (!nom || !email || !password || !matricule) {
    return res.status(400).json({
      success: false,
      message: 'nom, email, password et matricule sont requis',
    });
  }

  const t = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    const existingMatricule = await Enseignant.findOne({ where: { matricule }, transaction: t });
    if (existingMatricule) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'Ce matricule existe déjà' });
    }

    // User.beforeCreate hashe déjà le mot de passe (voir models/User.js)
    const user = await User.create({ nom, prenom, email, password, typeAdmin: 4 }, { transaction: t });

    const [role] = await Role.findOrCreate({
      where: { name: 'enseignant' },
      defaults: { name: 'enseignant' },
      transaction: t,
    });
    await user.addRole(role, { transaction: t });

    const enseignant = await Enseignant.create({
      user_id: user.id,
      matricule,
      specialite: specialite || null,
      telephone: telephone || null,
    }, { transaction: t });

    await t.commit();

    const created = await Enseignant.findByPk(enseignant.id, {
      include: [{ model: User, attributes: ['id', 'nom', 'prenom', 'email'] }],
    });
    res.status(201).json(shape(created));
  } catch (err) {
    await t.rollback();
    console.error('[enseignantController.createEnseignant]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la création', detail: err.message });
  }
};

/**
 * PUT /api/v1/enseignants/:id
 * Met à jour le profil enseignant et, si fournis, les champs du compte utilisateur lié.
 */
exports.updateEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByPk(req.params.id, { include: [User] });
    if (!enseignant) {
      return res.status(404).json({ success: false, message: 'Enseignant non trouvé' });
    }

    const { nom, prenom, email, matricule, specialite, telephone, actif } = req.body;

    if (matricule && matricule !== enseignant.matricule) {
      const conflict = await Enseignant.findOne({ where: { matricule } });
      if (conflict) {
        return res.status(409).json({ success: false, message: 'Ce matricule existe déjà' });
      }
    }

    await enseignant.update({
      matricule: matricule ?? enseignant.matricule,
      specialite: specialite ?? enseignant.specialite,
      telephone: telephone ?? enseignant.telephone,
      actif: actif !== undefined ? (actif ? 1 : 0) : enseignant.actif,
    });

    if (enseignant.User && (nom !== undefined || prenom !== undefined || email !== undefined)) {
      await enseignant.User.update({
        nom: nom ?? enseignant.User.nom,
        prenom: prenom ?? enseignant.User.prenom,
        email: email ?? enseignant.User.email,
      });
    }

    const updated = await Enseignant.findByPk(enseignant.id, {
      include: [{ model: User, attributes: ['id', 'nom', 'prenom', 'email'] }],
    });
    res.json(shape(updated));
  } catch (err) {
    console.error('[enseignantController.updateEnseignant]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour', detail: err.message });
  }
};

/**
 * DELETE /api/v1/enseignants/:id
 * Désactive un enseignant (soft-disable, cohérent avec le champ `actif`
 * déjà utilisé partout ailleurs dans ce projet plutôt qu'une suppression
 * définitive qui casserait l'historique Notes/Incidents).
 */
exports.deleteEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByPk(req.params.id);
    if (!enseignant) {
      return res.status(404).json({ success: false, message: 'Enseignant non trouvé' });
    }
    await enseignant.update({ actif: 0 });
    res.json({ success: true, message: 'Enseignant désactivé' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la désactivation', detail: err.message });
  }
};

/**
 * POST /api/v1/enseignants/:id/restore
 * Réactive un enseignant désactivé.
 */
exports.restoreEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.findByPk(req.params.id);
    if (!enseignant) {
      return res.status(404).json({ success: false, message: 'Enseignant non trouvé' });
    }
    await enseignant.update({ actif: 1 });
    res.json({ success: true, message: 'Enseignant réactivé' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la réactivation', detail: err.message });
  }
};
