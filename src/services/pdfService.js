// src/services/pdfService.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Génération d'un PDF à partir d'un template HTML
const generatePdfFromHtml = async (html, options = {}) => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    ...options,
  });
  await browser.close();
  return pdf;
};

// Lire un template HTML
const getTemplate = (templateName, data) => {
  const source = fs.readFileSync(path.join(__dirname, '../templates/pdf', `${templateName}.hbs`), 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};

/**
 * Générer la fiche élève
 */
exports.generateFicheEleve = async (eleve) => {
  const html = getTemplate('fiche-eleve', { eleve });
  const pdfBuffer = await generatePdfFromHtml(html);
  const filename = `fiche_${eleve.matricule}_${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../storage/pdfs', filename);
  if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, pdfBuffer);
  return `${process.env.BASE_URL || 'http://localhost:3001'}/storage/pdfs/${filename}`;
};

/**
 * Générer le bulletin d'un élève
 */
exports.generateBulletinPdf = async (eleve, bulletin, sequence) => {
  const html = getTemplate('bulletin', { eleve, bulletin, sequence });
  const pdfBuffer = await generatePdfFromHtml(html);
  const filename = `bulletin_${eleve.matricule}_${sequence.idSequence}_${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../storage/pdfs', filename);
  if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, pdfBuffer);
  return {
    path: filepath,
    url: `${process.env.BASE_URL || 'http://localhost:3001'}/storage/pdfs/${filename}`,
    buffer: pdfBuffer
  };
};

/**
 * Générer la liste d'appel d'une classe
 */
exports.generateListeAppel = async (classe, eleves, date) => {
  const html = getTemplate('liste-appel', { classe, eleves, date });
  const pdfBuffer = await generatePdfFromHtml(html);
  const filename = `liste_appel_${classe.idClasse}_${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../storage/pdfs', filename);
  if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, pdfBuffer);
  return `${process.env.BASE_URL || 'http://localhost:3001'}/storage/pdfs/${filename}`;
};

/**
 * Générer la fiche discipline d'un incident
 */
exports.generateFicheDiscipline = async (incident) => {
  const html = getTemplate('fiche-discipline', { incident });
  const pdfBuffer = await generatePdfFromHtml(html);
  const filename = `discipline_${incident.id}_${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../storage/pdfs', filename);
  if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, pdfBuffer);
  return `${process.env.BASE_URL || 'http://localhost:3001'}/storage/pdfs/${filename}`;
};

/**
 * Générer un reçu de paiement
 */
exports.generateReceiptPdf = async (paiement, eleve) => {
  const html = getTemplate('recu-paiement', { paiement, eleve });
  const pdfBuffer = await generatePdfFromHtml(html);
  const filename = `recu_${paiement.numero_recu}_${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../storage/pdfs', filename);
  if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, pdfBuffer);
  return `${process.env.BASE_URL || 'http://localhost:3001'}/storage/pdfs/${filename}`;
};