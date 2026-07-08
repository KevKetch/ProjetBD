const { Note, Eleve, Matiere, Sequence, Enseignant, Bulletin } = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendAlertNote } = require('../jobs/sendAlertNote');
const { generateBulletinPdf } = require('../services/pdfService');

exports.createNote = async (req, res) => {
  const note = await Note.create(req.body);
  if (note.valeur < 10) {
    await sendAlertNote(note);
  }
  res.status(201).json(note);
};

exports.getNotesEleve = async (req, res) => {
  const notes = await Note.findAll({
    where: { eleve_matricule: req.params.matricule },
    include: [{ model: Matiere }, { model: Sequence }],
  });
  res.json(notes);
};

exports.getNotesClasse = async (req, res) => {
  const eleves = await Eleve.findAll({
    where: { classe_id: req.params.classe_id },
    attributes: ['matricule'],
  });
  const matricules = eleves.map(e => e.matricule);
  const notes = await Note.findAll({
    where: { eleve_matricule: { [Op.in]: matricules } },
    include: [{ model: Eleve }, { model: Matiere }, { model: Sequence }],
  });
  res.json(notes);
};

exports.getNotesMatiere = async (req, res) => {
  const notes = await Note.findAll({
    where: { matiere_id: req.params.matiere_id },
    include: [{ model: Eleve }],
  });
  res.json(notes);
};

exports.getNotesSequence = async (req, res) => {
  const notes = await Note.findAll({
    where: { sequence_id: req.params.sequence_id },
    include: [{ model: Eleve }, { model: Matiere }],
  });
  res.json(notes);
};

exports.getMoyennes = async (req, res) => {
  const moyennes = await Note.findAll({
    where: { eleve_matricule: req.params.matricule },
    attributes: [
      'matiere_id',
      [sequelize.fn('AVG', sequelize.col('valeur')), 'moyenne'],
    ],
    group: ['matiere_id'],
    include: [{ model: Matiere }],
  });
  res.json(moyennes);
};

exports.generateBulletin = async (req, res) => {
  const { eleve_matricule, sequence_id } = req.body;
  // Appel au service PDF
  const pdfUrl = await generateBulletinPdf(eleve_matricule, sequence_id);
  res.json({ pdf_url: pdfUrl });
};

exports.getBulletinPdf = async (req, res) => {
  const bulletin = await Bulletin.findByPk(req.params.id);
  if (!bulletin) return res.status(404).json({ success: false, message: 'Bulletin non trouvé' });
  res.download(bulletin.pdf_path);
};

exports.getBulletinsEleve = async (req, res) => {
  const bulletins = await Bulletin.findAll({
    where: { eleve_matricule: req.params.matricule },
    include: [{ model: Sequence }],
  });
  res.json(bulletins);
};

exports.getStatistiquesNotes = async (req, res) => {
  const moyenneGenerale = await Note.findOne({
    attributes: [[sequelize.fn('AVG', sequelize.col('valeur')), 'moyenne']],
  });
  const parMatiere = await Note.findAll({
    attributes: [
      'matiere_id',
      [sequelize.fn('AVG', sequelize.col('valeur')), 'moyenne'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
    ],
    group: ['matiere_id'],
    include: [{ model: Matiere }],
  });
  res.json({ moyenne_generale: moyenneGenerale.dataValues.moyenne, par_matiere: parMatiere });
};
