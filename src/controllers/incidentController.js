const { Incident, Eleve, TypeIncident, Enseignant, Sanction } = require('../models');
const { sequelize } = require('../models');
const { sendIncidentNotification } = require('../jobs/sendIncidentNotification');
const { Op } = require('sequelize');
const { generateFicheDiscipline } = require('../services/pdfService');

exports.createIncident = async (req, res) => {
  const incident = await Incident.create(req.body);
  if (incident.gravite >= 3) {
    await sendIncidentNotification(incident);
  }
  res.status(201).json(incident);
};

exports.getIncidentsEleve = async (req, res) => {
  const incidents = await Incident.findAll({
    where: { eleve_matricule: req.params.matricule },
    include: [{ model: TypeIncident }],
  });
  res.json(incidents);
};

exports.getIncidentsClasse = async (req, res) => {
  const eleves = await Eleve.findAll({
    where: { classe_id: req.params.classe_id },
    attributes: ['matricule'],
  });
  const matricules = eleves.map(e => e.matricule);
  const incidents = await Incident.findAll({
    where: { eleve_matricule: { [Op.in]: matricules } },
    include: [{ model: TypeIncident }, { model: Eleve }],
  });
  res.json(incidents);
};

exports.ajouterSanction = async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident non trouvé' });
  }
  const sanction = await Sanction.create({ ...req.body, incident_id: incident.id });
  res.status(201).json(sanction);
};

exports.listTypesIncidents = async (req, res) => {
  const types = await TypeIncident.findAll();
  res.json(types);
};

exports.updateIncident = async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident non trouvé' });
  }
  await incident.update(req.body);
  res.json(incident);
};

exports.getStatistiquesIncidents = async (req, res) => {
  const parType = await Incident.findAll({
    attributes: [
      'type_incident_id',
      [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
    ],
    group: ['type_incident_id'],
    include: [{ model: TypeIncident }],
  });
  res.json({ par_type: parType });
};

exports.generatePdfIncident = async (req, res) => {
  const incident = await Incident.findByPk(req.params.id, {
    include: [{ model: Eleve }, { model: TypeIncident }],
  });
  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident non trouvé' });
  }
  const pdfUrl = await generateFicheDiscipline(incident);
  res.json({ pdf_url: pdfUrl });
};
