const { Presence, Eleve, Classe } = require('../models');
const { sendAbsenceAlert } = require('../jobs/sendAbsenceAlert');
const { Op } = require('sequelize');
const { generateListeAppel } = require('../services/pdfService');

exports.createPresence = async (req, res) => {
  const presence = await Presence.create(req.body);
  if (presence.statut === 'absent') {
    await sendAbsenceAlert(presence);
  }
  res.status(201).json(presence);
};

exports.getPresencesEleve = async (req, res) => {
  const presences = await Presence.findAll({
    where: { eleve_matricule: req.params.matricule },
  });
  res.json(presences);
};

exports.getPresencesClasse = async (req, res) => {
  const eleves = await Eleve.findAll({
    where: { classe_id: req.params.classe_id },
    attributes: ['matricule'],
  });
  const matricules = eleves.map(e => e.matricule);
  const presences = await Presence.findAll({
    where: { eleve_matricule: { [Op.in]: matricules } },
    include: [{ model: Eleve }],
  });
  res.json(presences);
};

exports.justifierPresence = async (req, res) => {
  const { motif, piece_jointe } = req.body;
  const presence = await Presence.findByPk(req.params.id);
  if (!presence) {
    return res.status(404).json({ success: false, message: 'Présence non trouvée' });
  }
  presence.justifiee = true;
  presence.motif_absence = motif;
  if (piece_jointe) {
    // upload du fichier (simplifié)
    presence.piece_jointe = piece_jointe; // en réalité, stockage via multer
  }
  await presence.save();
  res.json(presence);
};

exports.getStatistiquesPresences = async (req, res) => {
  const total = await Presence.count();
  const absents = await Presence.count({ where: { statut: 'absent' } });
  const taux = total ? (absents / total) * 100 : 0;
  res.json({ taux_absenteisme: parseFloat(taux.toFixed(2)) });
};

exports.listeAppel = async (req, res) => {
  const classe = await Classe.findByPk(req.params.classe_id);
  if (!classe) {
    return res.status(404).json({ success: false, message: 'Classe non trouvée' });
  }
  const eleves = await Eleve.findAll({ where: { classe_id: req.params.classe_id } });
  // Génération PDF via service
  const pdfUrl = await generateListeAppel(classe, eleves, new Date());
  res.json({ pdf_url: pdfUrl });
};
