const twilio = require('twilio');

let client;
const getTwilioClient = () => {
  if (client) return client;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    console.warn('[Twilio] Identifiants manquants (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN). Les SMS seront simulés.');
    return null;
  }
  client = twilio(sid, token);
  return client;
};

exports.sendSms = async ({ to, message }) => {
  const twClient = getTwilioClient();
  if (!twClient) {
    console.log(`[SMS Simulé] Pour: ${to} | Message: ${message}`);
    return { sid: 'mock_sid_success' };
  }
  return twClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
};

exports.sendAbsenceSms = async (eleve, presence) => {
  const message = `Absence de ${eleve.prenom} ${eleve.nom} le ${presence.date}. Motif : ${presence.motif_absence || 'Non justifié'}`;
  return exports.sendSms({ to: eleve.Parent.telephone, message });
};
