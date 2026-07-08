const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Génération d'un PDF à partir d'un template HTML
const generatePdfFromHtml = async (html, options = {}) => {
  const browser = await puppeteer.launch({ headless: true });
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

// Génération de la fiche élève
exports.generateFicheEleve = async (eleve) => {
  const html = `
    <html>
      <head><style>body { font-family: Arial; }</style></head>
      <body>
        <h1>Fiche élève</h1>
        <p>Matricule: ${eleve.matricule}</p>
        <p>Nom: ${eleve.nom}</p>
        <p>Prénom: ${eleve.prenom}</p>
        <p>Classe: ${eleve.Classe ? eleve.Classe.libelle : ''}</p>
      </body>
    </html>
  `;
  const pdfBuffer = await generatePdfFromHtml(html);
  // Sauvegarder le PDF et retourner l'URL
  const filename = `fiche_${eleve.matricule}_${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '../../storage/pdfs', filename);
  if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, pdfBuffer);
  return `${process.env.BASE_URL}/storage/pdfs/${filename}`;
};

// Génération bulletin
exports.generateBulletinPdf = async (matricule, sequenceId) => {
  // Récupérer les données et générer le HTML
  // ...
  // Retourner l'URL
};

// Génération liste d'appel
exports.generateListeAppel = async (classe, eleves, date) => {
  // ...
};

// Génération fiche discipline
exports.generateFicheDiscipline = async (incident) => {
  // ...
};
