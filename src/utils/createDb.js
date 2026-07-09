require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'ecole_db';

  console.log(`Connexion à MySQL sur ${host}:${port} avec l'utilisateur '${user}'...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    console.log(`Création de la base de données '${database}' (si elle n'existe pas)...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Base de données '${database}' créée ou déjà existante.`);
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur lors de la création de la base de données :', error.message);
    process.exit(1);
  }
}

createDatabase();
