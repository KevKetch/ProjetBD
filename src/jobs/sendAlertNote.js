const { noteQueue } = require('./index');
const emailService = require('../services/emailService');

exports.sendAlertNote = async (note) => {
  // On peut soit appeler directement le service, soit ajouter à la queue
  // Ici on utilise la queue
  await noteQueue.add({ note });
};

// Processeur
exports.processSendAlertNote = async ({ note }) => {
  const eleve = await note.getEleve({ include: ['Parent'] });
  await emailService.sendAlerteNote(eleve, note);
};
