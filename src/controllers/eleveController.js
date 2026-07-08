const { Eleve, Classe, Parent, Note, Incident, Presence } = require('../models');
const { generateFicheEleve } = require('../services/pdfService');
const { Op } = require('sequelize');

exports.listEleves = async (req, res) => {
  const { classe_id, q, page = 1, limit = 15 } = req.query;
  const where = {};
  if (classe_id) where.classe_id = classe_id;
  if (q) {
    where[Op.or] = [
      { nom: { [Op.iLike]: `%${q}%` } },
      { prenom: { [Op.iLike]: `%${q}%` } },
      { matricule: { [Op.iLike]: `%${q}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await Eleve.findAndCountAll({
    where,
    include: [{ model: Classe }, { model: Parent }],
    limit: parseInt(limit, 10),
    offset,
    order: [['createdAt', 'DESC']],
  });
  res.json({
    data: rows,
    meta: { total: count, page, limit, pages: Math.ceil(count / limit) },
  });
};

exports.getEleve = async (req, res) => {
  const eleve = await Eleve.findByPk(req.params.matricule, {
    include: [{ model: Classe }, { model: Parent }, { model: Note }, { model: Incident }, { model: Presence }],
  });
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  res.json(eleve);
};

exports.createEleve = async (req, res) => {
  const eleve = await Eleve.create(req.body);
  res.status(201).json(eleve);
};

exports.updateEleve = async (req, res) => {
  const eleve = await Eleve.findByPk(req.params.matricule);
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  await eleve.update(req.body);
  res.json(eleve);
};

exports.deleteEleve = async (req, res) => {
  const eleve = await Eleve.findByPk(req.params.matricule);
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  await eleve.destroy();
  res.json({ success: true, message: 'Élève supprimé' });
};

exports.inscrire = async (req, res) => {
  const { classe_id } = req.body;
  const eleve = await Eleve.findByPk(req.params.matricule);
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  eleve.classe_id = classe_id;
  eleve.date_inscription = new Date();
  eleve.statut = 'actif';
  await eleve.save();
  res.json(eleve);
};

exports.radier = async (req, res) => {
  const eleve = await Eleve.findByPk(req.params.matricule);
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  eleve.statut = 'radie';
  await eleve.save();
  res.json({ success: true, message: 'Élève radié' });
};

exports.changerClasse = async (req, res) => {
  const { classe_id } = req.body;
  const eleve = await Eleve.findByPk(req.params.matricule);
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  eleve.classe_id = classe_id;
  await eleve.save();
  res.json(eleve);
};

exports.historique = async (req, res) => {
  const eleve = await Eleve.findByPk(req.params.matricule, { paranoid: false });
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  // On retourne les données et les timestamps
  res.json(eleve);
};

exports.generatePdf = async (req, res) => {
  const eleve = await Eleve.findByPk(req.params.matricule, {
    include: [{ model: Classe }, { model: Parent }],
  });
  if (!eleve) {
    return res.status(404).json({ success: false, message: 'Élève non trouvé' });
  }
  const pdfUrl = await generateFicheEleve(eleve);
  res.json({ pdf_url: pdfUrl });
};
