const { incidentQueue } = require('./index');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

exports.sendIncidentNotification = async (incident) => {
  await incidentQueue.add({ incident });
};

exports.processSendIncidentNotification = async ({ incident }) => {
  const eleve = await incident.getEleve({ include: ['Parent'] });
  await emailService.sendAlerteIncident(eleve, incident);
  // Envoi SMS si téléphone disponible
  if (eleve.Parent && eleve.Parent.telephone) {
    await smsService.sendSms({
      to: eleve.Parent.telephone,
      message: `Incident signalé pour ${eleve.prenom} ${eleve.nom}`,
    });
  }
};
