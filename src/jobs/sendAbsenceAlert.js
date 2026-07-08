const { absenceQueue } = require('./index');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

exports.sendAbsenceAlert = async (presence) => {
  await absenceQueue.add({ presence });
};

exports.processSendAbsenceAlert = async ({ presence }) => {
  const eleve = await presence.getEleve({ include: ['Parent'] });
  await emailService.sendAlerteAbsence(eleve, presence);
  if (eleve.Parent && eleve.Parent.telephone) {
    await smsService.sendAbsenceSms(eleve, presence);
  }
};
