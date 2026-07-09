// seed_sample_data.js
// Inserts 5 classes, 5 students (with corresponding personne, parent, and admin/user entries).
// Also populates the user table with default login accounts.

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecole_db'
  };

  console.log('Connexion à la base de données ecole_db...');
  const conn = await mysql.createConnection(dbConfig);

  // 1. Clean existing records for fresh seed
  console.log('Nettoyage des données existantes...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('DELETE FROM parent');
  await conn.query('DELETE FROM eleve');
  await conn.query('DELETE FROM classe');
  await conn.query('DELETE FROM user');
  await conn.query('DELETE FROM admin WHERE username != "admin@ecole.cm"'); // keep superadmin
  await conn.query('DELETE FROM personne');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // 2. Insert 5 Classes
  console.log('Insertion de 5 classes...');
  const classes = [
    { libelle: 'SIL A', idCycle: 1, idAdmin: 1 },
    { libelle: 'CP B', idCycle: 1, idAdmin: 1 },
    { libelle: 'CE1 C', idCycle: 1, idAdmin: 1 },
    { libelle: 'CE2 D', idCycle: 1, idAdmin: 1 },
    { libelle: 'CM1 E', idCycle: 1, idAdmin: 1 }
  ];
  
  const classIds = [];
  for (const c of classes) {
    const [res] = await conn.execute(
      'INSERT INTO classe (libelle, idCycle, idAdmin) VALUES (?, ?, ?)',
      [c.libelle, c.idCycle, c.idAdmin]
    );
    classIds.push(res.insertId);
    console.log(`Classe créée : ${c.libelle} (ID: ${res.insertId})`);
  }

  // 3. Prepare parent/student data
  const sampleData = [
    {
      studentNom: 'Abena', studentPrenom: 'Marc', studentSexe: 1, studentNiveau: 'SIL', classIdx: 0,
      parentNom: 'Abena', parentPrenom: 'Jean', parentSexe: 1, parentTel: '677112233', parentEmail: 'jean.abena@parent.ecole.cm'
    },
    {
      studentNom: 'Bella', studentPrenom: 'Marie', studentSexe: 2, studentNiveau: 'CP', classIdx: 1,
      parentNom: 'Bella', parentPrenom: 'Pierre', parentSexe: 1, parentTel: '677445566', parentEmail: 'pierre.bella@parent.ecole.cm'
    },
    {
      studentNom: 'Camara', studentPrenom: 'Ousmane', studentSexe: 1, studentNiveau: 'CE1', classIdx: 2,
      parentNom: 'Camara', parentPrenom: 'Fatoumata', parentSexe: 2, parentTel: '699223344', parentEmail: 'fatoumata.camara@parent.ecole.cm'
    },
    {
      studentNom: 'Dongmo', studentPrenom: 'Arthur', studentSexe: 1, studentNiveau: 'CE2', classIdx: 3,
      parentNom: 'Dongmo', parentPrenom: 'Charles', parentSexe: 1, parentTel: '655667788', parentEmail: 'charles.dongmo@parent.ecole.cm'
    },
    {
      studentNom: 'Eto\'o', studentPrenom: 'Samuel Jr', studentSexe: 1, studentNiveau: 'CM1', classIdx: 4,
      parentNom: 'Eto\'o', parentPrenom: 'Samuel Sr', parentSexe: 1, parentTel: '699009900', parentEmail: 'samuel.etoo@parent.ecole.cm'
    }
  ];

  console.log('Insertion des élèves, personnes, parents et comptes d\'accès...');
  const passwordHash = await bcrypt.hash('1234', 10);
  const passwordRootHash = await bcrypt.hash('root', 10);

  for (const s of sampleData) {
    // A. Insert student into personne
    const [sPersRes] = await conn.execute(
      'INSERT INTO personne (nom, prenom, sexe) VALUES (?, ?, ?)',
      [s.studentNom, s.studentPrenom, s.studentSexe]
    );
    const sPersId = sPersRes.insertId;

    // B. Insert student into eleve
    const [sEleveRes] = await conn.execute(
      'INSERT INTO eleve (nom, prenom, dateNaissance, lieuNaissance, sexe, idClasse, idVilleNaissance, idAdmin, idPers, actif, statut, niveau) VALUES (?, ?, "2015-05-15", "Yaoundé", ?, ?, 1, 1, ?, 1, "actif", ?)',
      [s.studentNom, s.studentPrenom, s.studentSexe, classIds[s.classIdx], sPersId, s.studentNiveau]
    );
    const matricule = sEleveRes.insertId;

    // C. Insert parent into personne
    const [pPersRes] = await conn.execute(
      'INSERT INTO personne (nom, prenom, sexe, telephone) VALUES (?, ?, ?, ?)',
      [s.parentNom, s.parentPrenom, s.parentSexe, s.parentTel]
    );
    const pPersId = pPersRes.insertId;

    // D. Insert parent links
    await conn.execute(
      'INSERT INTO parent (idPers, matricule, idAdmin) VALUES (?, ?, 1)',
      [pPersId, matricule]
    );

    // E. Create account in admin table
    const nomComplet = `${s.parentPrenom} ${s.parentNom}`.trim();
    await conn.execute(
      'INSERT INTO admin (nom, username, password, actif, typeAdmin, mobile, idPers) VALUES (?, ?, ?, 1, 5, ?, ?)',
      [nomComplet, s.parentEmail, passwordHash, s.parentTel, pPersId]
    );

    // F. Create account in user table (with parent role)
    await conn.execute(
      'INSERT INTO user (person_id, email, username, password_hash, role, is_active) VALUES (?, ?, ?, ?, "parent", 1)',
      [pPersId, s.parentEmail, s.parentEmail, passwordHash]
    );

    console.log(`Élève inscrit : ${s.studentPrenom} ${s.studentNom} (Matricule: ${matricule}) — Parent: ${nomComplet}`);
  }

  // 4. Populate users table with other default accounts
  console.log('Alimentation de la table user avec les comptes d\'administration par défaut...');

  // Super Admin
  const [saPers] = await conn.execute('INSERT INTO personne (nom, prenom) VALUES ("Super Admin", "")');
  await conn.execute(
    'INSERT INTO user (person_id, email, username, password_hash, role, is_active) VALUES (?, "admin@ecole.cm", "admin@ecole.cm", ?, "admin", 1)',
    [saPers.insertId, passwordRootHash]
  );

  // Directeur
  const [dirPers] = await conn.execute('INSERT INTO personne (nom, prenom, telephone) VALUES ("Tchamba", "Rose", "677001122")');
  await conn.execute(
    'INSERT INTO admin (nom, username, password, actif, typeAdmin, mobile, idPers) VALUES ("Tchamba Rose", "directeur@ecole.cm", ?, 1, 2, "677001122", ?)',
    [passwordHash, dirPers.insertId]
  );
  await conn.execute(
    'INSERT INTO user (person_id, email, username, password_hash, role, is_active) VALUES (?, "directeur@ecole.cm", "directeur@ecole.cm", ?, "directeur", 1)',
    [dirPers.insertId, passwordHash]
  );

  // Fondateur
  const [fonPers] = await conn.execute('INSERT INTO personne (nom, prenom, telephone) VALUES ("Kamga", "Emmanuel", "699887766")');
  await conn.execute(
    'INSERT INTO admin (nom, username, password, actif, typeAdmin, mobile, idPers) VALUES ("Kamga Emmanuel", "fondateur@ecole.cm", ?, 1, 1, "699887766", ?)',
    [passwordHash, fonPers.insertId]
  );
  await conn.execute(
    'INSERT INTO user (person_id, email, username, password_hash, role, is_active) VALUES (?, "fondateur@ecole.cm", "fondateur@ecole.cm", ?, "fondateur", 1)',
    [fonPers.insertId, passwordHash]
  );

  // Enseignant
  const [ensPers] = await conn.execute('INSERT INTO personne (nom, prenom, telephone) VALUES ("Nkomo", "Albert", "655443322")');
  await conn.execute(
    'INSERT INTO admin (nom, username, password, actif, typeAdmin, mobile, idPers) VALUES ("Nkomo Albert", "enseignant@ecole.cm", ?, 1, 4, "655443322", ?)',
    [passwordHash, ensPers.insertId]
  );
  await conn.execute(
    'INSERT INTO user (person_id, email, username, password_hash, role, is_active) VALUES (?, "enseignant@ecole.cm", "enseignant@ecole.cm", ?, "enseignant", 1)',
    [ensPers.insertId, passwordHash]
  );

  // Parent
  const [prPers] = await conn.execute('INSERT INTO personne (nom, prenom, telephone) VALUES ("Ebongue", "Marie", "676543210")');
  await conn.execute(
    'INSERT INTO admin (nom, username, password, actif, typeAdmin, mobile, idPers) VALUES ("Ebongue Marie", "parent@ecole.cm", ?, 1, 5, "676543210", ?)',
    [passwordHash, prPers.insertId]
  );
  await conn.execute(
    'INSERT INTO user (person_id, email, username, password_hash, role, is_active) VALUES (?, "parent@ecole.cm", "parent@ecole.cm", ?, "parent", 1)',
    [prPers.insertId, passwordHash]
  );

  await conn.end();
  console.log('Seeding des données complété avec succès !');
}

run().catch(err => {
  console.error('Erreur lors du seeding des données :', err);
  process.exit(1);
});
