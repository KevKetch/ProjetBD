const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSms = async ({ to, message }) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
};

exports.sendAbsenceSms = async (eleve, presence) => {
  const message = `Absence de ${eleve.prenom} ${eleve.nom} le ${presence.date}. Motif : ${presence.motif_absence || 'Non justifié'}`;
  return exports.sendSms({ to: eleve.Parent.telephone, message });
};
