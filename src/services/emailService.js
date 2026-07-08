const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getTemplate = (templateName, data) => {
  const source = fs.readFileSync(path.join(__dirname, '../templates/emails', `${templateName}.hbs`), 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};

exports.sendEmail = async ({ to, subject, html, attachments = [] }) => {
  return transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
    attachments,
  });
};

exports.sendBulletin = async (eleve, bulletin, pdfBuffer) => {
  const html = getTemplate('bulletin', { eleve, bulletin });
  return exports.sendEmail({
    to: eleve.Parent.email,
    subject: `Bulletin de ${eleve.prenom} ${eleve.nom}`,
    html,
    attachments: [
      {
        filename: `bulletin-${eleve.matricule}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
};

exports.sendAlerteAbsence = async (eleve, presence) => {
  const html = getTemplate('alerte-absence', { eleve, presence });
  return exports.sendEmail({
    to: eleve.Parent.email,
    subject: `Absence de ${eleve.prenom} ${eleve.nom}`,
    html,
  });
};

exports.sendAlerteIncident = async (eleve, incident) => {
  const html = getTemplate('incident', { eleve, incident });
  return exports.sendEmail({
    to: eleve.Parent.email,
    subject: `Signalement d'incident - ${eleve.prenom} ${eleve.nom}`,
    html,
  });
};

exports.sendAlerteNote = async (eleve, note) => {
  const html = getTemplate('note-faible', { eleve, note });
  return exports.sendEmail({
    to: eleve.Parent.email,
    subject: `Alerte note - ${eleve.prenom} ${eleve.nom}`,
    html,
  });
};
