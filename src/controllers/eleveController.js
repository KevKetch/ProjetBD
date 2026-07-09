const { Eleve } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const parseMatricule = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? val : n;
};

/* Normalise une chaîne en slug d'email (sans accents, espaces → point) */
const toSlug = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.');

/* ─────────────────────────────────────────────────────────────────────────
   Liste des élèves avec infos parent jointes
───────────────────────────────────────────────────────────────────────── */
exports.listEleves = async (req, res) => {
  try {
    const { page = 1, limit = 500, q, classe_id } = req.query;
    const where = {};
    if (classe_id) where.classe_id = classe_id;
    if (q) {
      const parsedQ = parseMatricule(q);
      const orConditions = [
        { nom: { [Op.like]: `%${q}%` } },
        { prenom: { [Op.like]: `%${q}%` } },
      ];
      if (!isNaN(parsedQ)) orConditions.push({ matricule: parsedQ });
      where[Op.or] = orConditions;
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Eleve.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']],
    });

    const augmentedRows = await Promise.all(rows.map(async (eleve) => {
      const mat = eleve.getDataValue('matricule');
      const [parentRows] = await Eleve.sequelize.query(`
        SELECT p.nom, p.prenom, a.username AS email, a.mobile AS tel
        FROM Parents pr
        INNER JOIN Personne p ON pr.idPers = p.idPers
        LEFT JOIN Admin a ON a.typeAdmin = 5 AND (
          a.nom = CONCAT(p.prenom, ' ', p.nom) OR
          a.nom = CONCAT(p.nom, ' ', p.prenom)
        )
        WHERE pr.matricule = ?
        LIMIT 1
      `, { replacements: [mat], type: Eleve.sequelize.QueryTypes.SELECT });

      const plain = eleve.toJSON();
      if (parentRows && parentRows.length > 0) {
        plain.parentNom   = `${parentRows[0].prenom} ${parentRows[0].nom}`.trim();
        plain.parentEmail = parentRows[0].email;
        plain.parentTel   = parentRows[0].tel;
      }
      return plain;
    }));

    res.json({ data: augmentedRows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
  } catch (err) {
    console.error('[eleveController.listEleves]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   Détail d'un élève
───────────────────────────────────────────────────────────────────────── */
exports.getEleve = async (req, res) => {
  try {
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });

    const [parentRows] = await Eleve.sequelize.query(`
      SELECT p.nom, p.prenom, a.username AS email, a.mobile AS tel
      FROM Parents pr
      INNER JOIN Personne p ON pr.idPers = p.idPers
      LEFT JOIN Admin a ON a.typeAdmin = 5 AND (
        a.nom = CONCAT(p.prenom, ' ', p.nom) OR
        a.nom = CONCAT(p.nom, ' ', p.prenom)
      )
      WHERE pr.matricule = ?
      LIMIT 1
    `, { replacements: [matricule], type: Eleve.sequelize.QueryTypes.SELECT });

    const plain = eleve.toJSON();
    if (parentRows && parentRows.length > 0) {
      plain.parentNom   = `${parentRows[0].prenom} ${parentRows[0].nom}`.trim();
      plain.parentEmail = parentRows[0].email;
      plain.parentTel   = parentRows[0].tel;
    }
    res.json(plain);
  } catch (err) {
    console.error('[eleveController.getEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   Créer un élève  (+ Personne + Parents + compte Admin parent)
───────────────────────────────────────────────────────────────────────── */
exports.createEleve = async (req, res) => {
  const transaction = await Eleve.sequelize.transaction();
  try {
    // photo peut être null
    const body = { ...req.body };
    if (body.photo === null || body.photo === undefined || body.photo === '') {
      delete body.photo; // laisse la BD utiliser sa valeur par défaut (NULL)
    }

    const eleve = await Eleve.create(body, { transaction });
    const matricule = eleve.getDataValue('matricule');

    let parentLoginEmail    = null;
    let parentLoginPassword = null;

    if (req.body.parentNom && req.body.parentNom.trim()) {
      const nameParts   = req.body.parentNom.trim().split(/\s+/);
      const parentNom    = nameParts[0] || 'Parent';
      const parentPrenom = nameParts.slice(1).join(' ') || 'Parent';
      const parentTel    = (req.body.parentTel || '').trim() || null;

      // Email : celui du formulaire OU auto-généré
      const autoEmail  = `${toSlug(parentPrenom)}.${toSlug(parentNom)}@parent.ecole.cm`;
      const parentEmail = (req.body.parentEmail && req.body.parentEmail.trim())
        ? req.body.parentEmail.trim()
        : autoEmail;

      // ── 1. Insérer dans Personne ───────────────────────────────
      const [personneResult] = await Eleve.sequelize.query(
        `INSERT INTO Personne (nom, prenom) VALUES (?, ?)`,
        { replacements: [parentNom, parentPrenom], type: Eleve.sequelize.QueryTypes.INSERT, transaction }
      );
      const idPers = typeof personneResult === 'object' ? personneResult[0] : personneResult;

      // ── 2. Lier dans Parents ───────────────────────────────────
      await Eleve.sequelize.query(
        `INSERT INTO Parents (idPers, matricule, idAdmin) VALUES (?, ?, ?)`,
        { replacements: [idPers, matricule, req.body.idAdmin || 1], type: Eleve.sequelize.QueryTypes.INSERT, transaction }
      );

      // ── 3. Créer compte Admin (typeAdmin=5) si inexistant ──────
      const [existingRows] = await Eleve.sequelize.query(
        `SELECT ID FROM Admin WHERE username = ? LIMIT 1`,
        { replacements: [parentEmail], type: Eleve.sequelize.QueryTypes.SELECT, transaction }
      );
      // existingRows est un tableau (potentiellement vide)
      if (!existingRows || existingRows.length === 0) {
        const rawPassword    = parentTel || '1234';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const nomComplet     = `${parentPrenom} ${parentNom}`.trim();
        await Eleve.sequelize.query(
          `INSERT INTO Admin (nom, username, password, actif, typeAdmin, mobile) VALUES (?, ?, ?, 1, 5, ?)`,
          { replacements: [nomComplet, parentEmail, hashedPassword, parentTel], type: Eleve.sequelize.QueryTypes.INSERT, transaction }
        );
        parentLoginEmail    = parentEmail;
        parentLoginPassword = rawPassword; // affiché une seule fois à l'admin
      } else {
        parentLoginEmail = parentEmail; // compte déjà existant
      }
    }

    await transaction.commit();
    res.status(201).json({ ...eleve.toJSON(), parentLoginEmail, parentLoginPassword });
  } catch (err) {
    await transaction.rollback();
    console.error('[eleveController.createEleve] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   Mettre à jour un élève
───────────────────────────────────────────────────────────────────────── */
exports.updateEleve = async (req, res) => {
  try {
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    await eleve.update(req.body);
    res.json(eleve);
  } catch (err) {
    console.error('[eleveController.updateEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   Supprimer un élève
───────────────────────────────────────────────────────────────────────── */
exports.deleteEleve = async (req, res) => {
  try {
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    await eleve.destroy();
    res.json({ success: true, message: 'Élève supprimé' });
  } catch (err) {
    console.error('[eleveController.deleteEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   Actions métier
───────────────────────────────────────────────────────────────────────── */
exports.inscrire = async (req, res) => {
  try {
    const { classe_id } = req.body;
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    eleve.classe_id = classe_id;
    eleve.statut = 'actif';
    await eleve.save();
    res.json(eleve);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.radier = async (req, res) => {
  try {
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    eleve.statut = 'radie';
    await eleve.save();
    res.json({ success: true, message: 'Élève radié' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changerClasse = async (req, res) => {
  try {
    const { classe_id } = req.body;
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    eleve.classe_id = classe_id;
    await eleve.save();
    res.json(eleve);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.historique = async (req, res) => {
  try {
    const matricule = parseMatricule(req.params.matricule);
    const eleve = await Eleve.findByPk(matricule, { paranoid: false });
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    res.json(eleve);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generatePdf = async (req, res) => {
  res.status(501).json({ success: false, message: 'Génération PDF non disponible' });
};
