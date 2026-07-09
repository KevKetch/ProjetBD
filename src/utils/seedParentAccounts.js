/**
 * seed-parent-accounts.js
 * Crée des comptes Admin (typeAdmin=5) pour tous les parents en base
 * qui n'ont pas encore de compte. Mot de passe par défaut : '1234'
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ecole_db',
  });

  console.log('🔍 Recherche des parents sans compte...\n');

  // Récupère tous les parents (Personne liée à Parents) avec leurs infos
  const [parents] = await conn.query(`
    SELECT p.idPers, p.nom, p.prenom, a.mobile AS tel
    FROM Personne p
    INNER JOIN Parents pr ON p.idPers = pr.idPers
    LEFT JOIN Admin a ON a.typeAdmin = 5 AND a.mobile = a.mobile
    WHERE p.idPers > 1
  `);

  let created = 0;
  const defaultPassword = '1234';
  const hashedDefault = await bcrypt.hash(defaultPassword, 10);

  for (const parent of parents) {
    const nomComplet = `${parent.prenom} ${parent.nom}`.trim();
    // Construire un username/email basé sur nom.prenom@ecole.parent
    const username = `${parent.prenom.toLowerCase()}.${parent.nom.toLowerCase()}@parent.ecole.cm`
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/\s+/g, '.');

    // Vérifier si un compte existe déjà
    const [existing] = await conn.query(
      `SELECT ID FROM Admin WHERE username = ? LIMIT 1`,
      [username]
    );

    if (existing.length === 0) {
      await conn.query(
        `INSERT INTO Admin (nom, username, password, actif, typeAdmin, mobile) VALUES (?, ?, ?, 1, 5, ?)`,
        [nomComplet, username, hashedDefault, parent.tel || null]
      );
      console.log(`✅ Compte créé : ${nomComplet} → ${username} (mot de passe: ${defaultPassword})`);
      created++;
    } else {
      // Si le compte existe mais on veut réinitialiser à '1234'
      await conn.query(
        `UPDATE Admin SET password = ? WHERE username = ?`,
        [hashedDefault, username]
      );
      console.log(`🔄 Mot de passe réinitialisé à '${defaultPassword}' pour : ${username}`);
    }
  }

  await conn.end();
  console.log(`\n🎉 Terminé ! ${created} compte(s) créé(s).`);
  console.log(`\n📋 COMPTES PARENTS DISPONIBLES :`);
  
  // Afficher tous les comptes parents
  const conn2 = await mysql.createConnection({
    host: 'localhost', port: 3306, user: 'root', password: '', database: 'ecole_db'
  });
  const [accounts] = await conn2.query(`SELECT ID, nom, username, typeAdmin FROM Admin WHERE typeAdmin = 5`);
  console.table(accounts);
  await conn2.end();
}

main().catch(console.error);
