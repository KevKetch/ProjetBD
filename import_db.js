// import_db.js
// Drops, recreates ecole_db database, cleans comments, and imports ecole_db.sql schema statement-by-statement.
// Safely skips invalid ALTER/CREATE statements using plural names (e.g. messages, notifications).

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
  };

  console.log('Connexion au serveur MySQL...');
  let connection = await mysql.createConnection(dbConfig);

  console.log('Suppression et re-création de la base de données ecole_db...');
  await connection.query('DROP DATABASE IF EXISTS ecole_db');
  await connection.query('CREATE DATABASE ecole_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
  await connection.close();

  console.log('Connexion à la nouvelle base de données ecole_db...');
  connection = await mysql.createConnection({
    ...dbConfig,
    database: 'ecole_db'
  });

  const sqlPath = path.join(__dirname, 'ecole_db.sql');
  console.log(`Lecture du fichier SQL : ${sqlPath}...`);
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // Clean single-line comments (starting with -- or #) and multi-line comments
  let cleanSql = sqlContent
    .replace(/--.*$/gm, '')
    .replace(/#.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const rawStatements = cleanSql.split(';');
  const statements = rawStatements
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Nombre total d'instructions SQL après nettoyage : ${statements.length}`);

  // Disable foreign keys checks before importing schema
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  let importCount = 0;
  let skipCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    // Skip specific legacy statements using plural table names (messages, notifications) that don't match the singular schema
    if (stmt.includes('ALTER TABLE `messages`') || 
        stmt.includes('CREATE TABLE IF NOT EXISTS `notifications`') ||
        stmt.includes('CREATE TABLE `notifications`')) {
      console.log(`[Import] Saut de l'instruction #${i + 1} car elle fait référence à des tables plurielles/obsolètes.`);
      skipCount++;
      continue;
    }

    try {
      await connection.query(stmt);
      importCount++;
    } catch (err) {
      console.error(`Erreur à l'instruction #${i + 1}:`);
      console.error(stmt);
      console.error('Détail de l\'erreur :', err.message);
      throw err;
    }
  }

  // Re-enable foreign keys checks
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log(`Importation complétée : ${importCount} exécutées, ${skipCount} sautées.`);

  console.log('Hachage des mots de passe pour les utilisateurs par défaut...');
  const passwordRootHash = await bcrypt.hash('root', 10);
  const password1234Hash = await bcrypt.hash('1234', 10);

  const adminsToSeed = [
    { nom: 'Super Admin', username: 'admin@ecole.cm', password: passwordRootHash, typeAdmin: 3, mobile: '600000001' },
    { nom: 'Tchamba Rose', username: 'directeur@ecole.cm', password: password1234Hash, typeAdmin: 2, mobile: '677001122' },
    { nom: 'Kamga Emmanuel', username: 'fondateur@ecole.cm', password: password1234Hash, typeAdmin: 1, mobile: '699887766' },
    { nom: 'Nkomo Albert', username: 'enseignant@ecole.cm', password: password1234Hash, typeAdmin: 4, mobile: '655443322' },
    { nom: 'Ebongue Marie', username: 'parent@ecole.cm', password: password1234Hash, typeAdmin: 5, mobile: '676543210' }
  ];

  console.log('Insertion des administrateurs par défaut dans la table admin...');
  for (const admin of adminsToSeed) {
    await connection.execute(
      'INSERT INTO admin (nom, username, password, typeAdmin, mobile, actif) VALUES (?, ?, ?, ?, ?, 1)',
      [admin.nom, admin.username, admin.password, admin.typeAdmin, admin.mobile]
    );
    console.log(`Utilisateur créé : ${admin.username}`);
  }

  await connection.close();
  console.log('Base de données restaurée et prête !');
}

run().catch(err => {
  console.error('Échec de la restauration de la base de données.');
  process.exit(1);
});
