// src/models/index.js
// Auto-loads all model files from this directory and sets up associations.
// Only associations between models that actually exist are registered,
// so missing model files are safely ignored.

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename  = path.basename(__filename);
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/database')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// ─── Load all model files in this directory ────────────────────────────────
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const modelFactory = require(path.join(__dirname, file));
    if (typeof modelFactory === 'function') {
      const model = modelFactory(sequelize, Sequelize.DataTypes);
      // model.name is set inside Model.init(); skip files that don't export a model
      if (model && model.name) {
        db[model.name] = model;
      }
    }
  });

// ─── Helper: only define an association when both ends exist ───────────────
const has = name => !!db[name];

// ─── ADMIN ─────────────────────────────────────────────────────────────────
if (has('Admin')) {
  if (has('Eleve'))          db.Admin.hasMany(db.Eleve,          { foreignKey: 'idAdmin', as: 'eleves' });
  if (has('Classe'))         db.Admin.hasMany(db.Classe,         { foreignKey: 'idAdmin', as: 'classes' });
  if (has('Matiere'))        db.Admin.hasMany(db.Matiere,        { foreignKey: 'idAdmin', as: 'matieres' });
  if (has('AnneeAcademique'))db.Admin.hasMany(db.AnneeAcademique,{ foreignKey: 'idAdmin', as: 'annees' });
  if (has('Trimestre'))      db.Admin.hasMany(db.Trimestre,      { foreignKey: 'idAdmin', as: 'trimestres' });
  if (has('Echeancier'))     db.Admin.hasMany(db.Echeancier,     { foreignKey: 'idAdmin', as: 'echeanciers' });
  if (has('Paiement'))       db.Admin.hasMany(db.Paiement,       { foreignKey: 'idAdmin', as: 'paiements' });
  if (has('Epreuve'))        db.Admin.hasMany(db.Epreuve,        { foreignKey: 'idAdmin', as: 'epreuves' });
}

// ─── PERSONNE ──────────────────────────────────────────────────────────────
if (has('Personne')) {
  if (has('Parent'))    db.Personne.hasMany(db.Parent,    { foreignKey: 'idPers', as: 'parents' });
  if (has('Enseignant'))db.Personne.hasMany(db.Enseignant,{ foreignKey: 'idPers', as: 'enseignants' });
  if (has('Epreuve'))   db.Personne.hasMany(db.Epreuve,   { foreignKey: 'idPers', as: 'epreuvesCrees' });
  if (has('Sequence'))  db.Personne.hasMany(db.Sequence,  { foreignKey: 'idPers', as: 'sequences' });
  if (has('Eleve'))     db.Personne.hasMany(db.Eleve,     { foreignKey: 'idPers', as: 'eleves' });
  if (has('Admin'))     db.Personne.hasMany(db.Admin,     { foreignKey: 'idPers', as: 'admins' });
}

// ─── ANNEE_ACADEMIQUE ──────────────────────────────────────────────────────
if (has('AnneeAcademique')) {
  if (has('Trimestre'))  db.AnneeAcademique.hasMany(db.Trimestre,  { foreignKey: 'idAca',   as: 'trimestres' });
  if (has('Echeancier')) db.AnneeAcademique.hasMany(db.Echeancier, { foreignKey: 'idAnnee', as: 'echeanciers' });
  if (has('Paiement'))   db.AnneeAcademique.hasMany(db.Paiement,   { foreignKey: 'idAnnee', as: 'paiements' });
  if (has('Incident'))   db.AnneeAcademique.hasMany(db.Incident,   { foreignKey: 'idAnnee', as: 'incidents' });
}

// ─── TRIMESTRE ─────────────────────────────────────────────────────────────
if (has('Trimestre')) {
  if (has('Sequence'))        db.Trimestre.hasMany(db.Sequence,        { foreignKey: 'idTrimestre', as: 'sequences' });
  if (has('Epreuve'))         db.Trimestre.hasMany(db.Epreuve,         { foreignKey: 'idTrimestre', as: 'epreuves' });
  if (has('AnneeAcademique')) db.Trimestre.belongsTo(db.AnneeAcademique,{ foreignKey: 'idAca',       as: 'anneeAcademique' });
  if (has('Admin'))           db.Trimestre.belongsTo(db.Admin,         { foreignKey: 'idAdmin',     as: 'admin' });
}

// ─── SEQUENCE ──────────────────────────────────────────────────────────────
if (has('Sequence')) {
  if (has('Note'))     db.Sequence.hasMany(db.Note,     { foreignKey: 'idSequence', as: 'notes' });
  if (has('Bulletin')) db.Sequence.hasMany(db.Bulletin, { foreignKey: 'idSequence', as: 'bulletins' });
  if (has('Trimestre'))db.Sequence.belongsTo(db.Trimestre,{ foreignKey: 'idTrimestre', as: 'trimestre' });
  if (has('Personne')) db.Sequence.belongsTo(db.Personne, { foreignKey: 'idPers',      as: 'personne' });
}

// ─── CLASSE ────────────────────────────────────────────────────────────────
if (has('Classe')) {
  if (has('Eleve'))      db.Classe.hasMany(db.Eleve,  { foreignKey: 'idClasse', as: 'eleves' });
  if (has('Epreuve'))    db.Classe.hasMany(db.Epreuve, { foreignKey: 'idClasse', as: 'epreuves' });
  if (has('Admin'))      db.Classe.belongsTo(db.Admin, { foreignKey: 'idAdmin',  as: 'admin' });
  if (has('Matiere') && has('MatiereClasse'))
    db.Classe.belongsToMany(db.Matiere, { through: db.MatiereClasse, foreignKey: 'classe_id', otherKey: 'matiere_id', as: 'matieres' });
}

// ─── ELEVE ─────────────────────────────────────────────────────────────────
if (has('Eleve')) {
  if (has('Parent'))     db.Eleve.hasMany(db.Parent,     { foreignKey: 'matricule', sourceKey: 'matricule', as: 'parents' });
  if (has('Paiement'))   db.Eleve.hasMany(db.Paiement,   { foreignKey: 'matricule', sourceKey: 'matricule', as: 'paiements' });
  if (has('Note'))       db.Eleve.hasMany(db.Note,       { foreignKey: 'matricule', sourceKey: 'matricule', as: 'notes' });
  if (has('EpreuveNote'))db.Eleve.hasMany(db.EpreuveNote,{ foreignKey: 'matricule', sourceKey: 'matricule', as: 'epreuveNotes' });
  if (has('Bulletin'))   db.Eleve.hasMany(db.Bulletin,   { foreignKey: 'matricule', sourceKey: 'matricule', as: 'bulletins' });
  if (has('Incident'))   db.Eleve.hasMany(db.Incident,   { foreignKey: 'matricule', sourceKey: 'matricule', as: 'incidents' });
  if (has('Presence'))   db.Eleve.hasMany(db.Presence,   { foreignKey: 'matricule', sourceKey: 'matricule', as: 'presences' });
  if (has('Retard'))     db.Eleve.hasMany(db.Retard,     { foreignKey: 'matricule', sourceKey: 'matricule', as: 'retards' });
  if (has('Classe'))     db.Eleve.belongsTo(db.Classe,   { foreignKey: 'idClasse',  as: 'classe' });
  if (has('Admin'))      db.Eleve.belongsTo(db.Admin,    { foreignKey: 'idAdmin',   as: 'admin' });
  if (has('Personne'))   db.Eleve.belongsTo(db.Personne, { foreignKey: 'idPers',    as: 'personne' });
}

// ─── PARENT ────────────────────────────────────────────────────────────────
if (has('Parent')) {
  if (has('Eleve'))   db.Parent.belongsTo(db.Eleve,   { foreignKey: 'matricule', targetKey: 'matricule', as: 'eleve' });
  if (has('Personne'))db.Parent.belongsTo(db.Personne, { foreignKey: 'idPers', as: 'personne' });
  if (has('Admin'))   db.Parent.belongsTo(db.Admin,   { foreignKey: 'idAdmin', as: 'admin' });
  if (has('User'))    db.Parent.belongsTo(db.User,    { foreignKey: 'user_id', as: 'user' });
  if (has('Message')) db.Parent.hasMany(db.Message,   { foreignKey: 'idParent', as: 'messages' });
}

// ─── ENSEIGNANT ────────────────────────────────────────────────────────────
if (has('Enseignant')) {
  if (has('Note'))    db.Enseignant.hasMany(db.Note,    { foreignKey: 'idEnseignant', as: 'notes' });
  if (has('Incident'))db.Enseignant.hasMany(db.Incident,{ foreignKey: 'idEnseignant', as: 'incidents' });
  if (has('Epreuve')) db.Enseignant.hasMany(db.Epreuve, { foreignKey: 'idEnseignant', as: 'epreuves' });
  if (has('Personne'))db.Enseignant.belongsTo(db.Personne,{ foreignKey: 'idPers',       as: 'personne' });
  if (has('Admin'))   db.Enseignant.belongsTo(db.Admin,  { foreignKey: 'idAdmin',      as: 'admin' });
  if (has('User'))    db.Enseignant.belongsTo(db.User,   { foreignKey: 'user_id',      as: 'user' });
  if (has('Matiere') && has('EnseignerMatiere'))
    db.Enseignant.belongsToMany(db.Matiere, { through: db.EnseignerMatiere, foreignKey: 'idEnseignant', otherKey: 'idMatiere', as: 'matieres' });
}

// ─── MATIERE ───────────────────────────────────────────────────────────────
if (has('Matiere')) {
  if (has('Epreuve'))      db.Matiere.hasMany(db.Epreuve,  { foreignKey: 'idMatiere', as: 'epreuves' });
  if (has('Note'))         db.Matiere.hasMany(db.Note,     { foreignKey: 'idMatiere', as: 'notes' });
  if (has('Admin'))        db.Matiere.belongsTo(db.Admin,  { foreignKey: 'idAdmin',   as: 'admin' });
  if (has('Classe') && has('MatiereClasse'))
    db.Matiere.belongsToMany(db.Classe,     { through: db.MatiereClasse,    foreignKey: 'matiere_id',   otherKey: 'classe_id',      as: 'classes' });
  if (has('Enseignant') && has('EnseignerMatiere'))
    db.Matiere.belongsToMany(db.Enseignant, { through: db.EnseignerMatiere, foreignKey: 'idMatiere',    otherKey: 'idEnseignant',   as: 'enseignants' });
}

// ─── MATIERE_CLASSE ────────────────────────────────────────────────────────
if (has('MatiereClasse')) {
  if (has('Matiere'))    db.MatiereClasse.belongsTo(db.Matiere,    { foreignKey: 'matiere_id',   as: 'matiere' });
  if (has('Classe'))     db.MatiereClasse.belongsTo(db.Classe,     { foreignKey: 'classe_id',    as: 'classe' });
  if (has('Enseignant')) db.MatiereClasse.belongsTo(db.Enseignant, { foreignKey: 'enseignant_id',as: 'enseignant' });
}

// ─── NATURE_EPREUVE ────────────────────────────────────────────────────────
if (has('NatureEpreuve') && has('Epreuve')) {
  db.NatureEpreuve.hasMany(db.Epreuve, { foreignKey: 'idNature', as: 'epreuves' });
}

// ─── EPREUVE ───────────────────────────────────────────────────────────────
if (has('Epreuve')) {
  if (has('Trimestre'))    db.Epreuve.belongsTo(db.Trimestre,    { foreignKey: 'idTrimestre', as: 'trimestre' });
  if (has('NatureEpreuve'))db.Epreuve.belongsTo(db.NatureEpreuve,{ foreignKey: 'idNature',    as: 'nature' });
  if (has('Matiere'))      db.Epreuve.belongsTo(db.Matiere,      { foreignKey: 'idMatiere',   as: 'matiere' });
  if (has('Classe'))       db.Epreuve.belongsTo(db.Classe,       { foreignKey: 'idClasse',    as: 'classe' });
  if (has('Enseignant'))   db.Epreuve.belongsTo(db.Enseignant,   { foreignKey: 'idEnseignant',as: 'enseignant' });
  if (has('Admin'))        db.Epreuve.belongsTo(db.Admin,        { foreignKey: 'idAdmin',     as: 'admin' });
  if (has('Personne'))     db.Epreuve.belongsTo(db.Personne,     { foreignKey: 'idPers',      as: 'enseignantPersonne' });
  if (has('EpreuveNote'))  db.Epreuve.hasMany(db.EpreuveNote,    { foreignKey: 'idEpreuve',   as: 'notes' });
}

// ─── EPREUVE_NOTE ──────────────────────────────────────────────────────────
if (has('EpreuveNote')) {
  if (has('Epreuve'))db.EpreuveNote.belongsTo(db.Epreuve,{ foreignKey: 'idEpreuve', as: 'epreuve' });
  if (has('Eleve'))  db.EpreuveNote.belongsTo(db.Eleve,  { foreignKey: 'matricule', as: 'eleve' });
}

// ─── NOTE ──────────────────────────────────────────────────────────────────
if (has('Note')) {
  if (has('Eleve'))     db.Note.belongsTo(db.Eleve,     { foreignKey: 'matricule',    targetKey: 'matricule', as: 'eleve' });
  if (has('Matiere'))   db.Note.belongsTo(db.Matiere,   { foreignKey: 'idMatiere',    as: 'matiere' });
  if (has('Sequence'))  db.Note.belongsTo(db.Sequence,  { foreignKey: 'idSequence',   as: 'sequence' });
  if (has('Enseignant'))db.Note.belongsTo(db.Enseignant,{ foreignKey: 'idEnseignant', as: 'enseignant' });
  if (has('Epreuve'))   db.Note.belongsTo(db.Epreuve,   { foreignKey: 'idEpreuve',    as: 'epreuve' });
}

// ─── BULLETIN ──────────────────────────────────────────────────────────────
if (has('Bulletin')) {
  if (has('Eleve'))   db.Bulletin.belongsTo(db.Eleve,   { foreignKey: 'matricule',  targetKey: 'matricule', as: 'eleve' });
  if (has('Sequence'))db.Bulletin.belongsTo(db.Sequence,{ foreignKey: 'idSequence', as: 'sequence' });
  if (has('Admin'))   db.Bulletin.belongsTo(db.Admin,   { foreignKey: 'idAdmin',    as: 'admin' });
}

// ─── FRAIS ─────────────────────────────────────────────────────────────────
if (has('Frais') && has('Echeancier')) {
  db.Frais.hasMany(db.Echeancier, { foreignKey: 'idFrais', as: 'echeanciers' });
}

// ─── ECHEANCIER ────────────────────────────────────────────────────────────
if (has('Echeancier')) {
  if (has('Frais'))          db.Echeancier.belongsTo(db.Frais,         { foreignKey: 'idFrais',  as: 'frais' });
  if (has('AnneeAcademique'))db.Echeancier.belongsTo(db.AnneeAcademique,{ foreignKey: 'idAnnee', as: 'annee' });
  if (has('Paiement'))       db.Echeancier.hasMany(db.Paiement,        { foreignKey: 'idEcheancier', as: 'paiements' });
}

// ─── PAIEMENT ──────────────────────────────────────────────────────────────
if (has('Paiement')) {
  if (has('Eleve'))          db.Paiement.belongsTo(db.Eleve,          { foreignKey: 'matricule', targetKey: 'matricule', as: 'eleve' });
  if (has('Echeancier'))     db.Paiement.belongsTo(db.Echeancier,     { foreignKey: 'idEcheancier', as: 'echeancier' });
  if (has('Admin'))          db.Paiement.belongsTo(db.Admin,          { foreignKey: 'idAdmin',   as: 'admin' });
  if (has('AnneeAcademique'))db.Paiement.belongsTo(db.AnneeAcademique,{ foreignKey: 'idAnnee',   as: 'annee' });
}

// ─── PRESENCE ──────────────────────────────────────────────────────────────
if (has('Presence') && has('Eleve')) {
  db.Presence.belongsTo(db.Eleve, { foreignKey: 'matricule', targetKey: 'matricule', as: 'eleve' });
}

// ─── RETARD ────────────────────────────────────────────────────────────────
if (has('Retard') && has('Eleve')) {
  db.Retard.belongsTo(db.Eleve, { foreignKey: 'matricule', targetKey: 'matricule', as: 'eleve' });
}

// ─── TYPE_INCIDENT ─────────────────────────────────────────────────────────
if (has('TypeIncident') && has('Incident')) {
  db.TypeIncident.hasMany(db.Incident, { foreignKey: 'idTypeIncident', as: 'incidents' });
}

// ─── INCIDENT ──────────────────────────────────────────────────────────────
if (has('Incident')) {
  if (has('Eleve'))       db.Incident.belongsTo(db.Eleve,       { foreignKey: 'matricule',     targetKey: 'matricule', as: 'eleve' });
  if (has('TypeIncident'))db.Incident.belongsTo(db.TypeIncident,{ foreignKey: 'idTypeIncident', as: 'typeIncident' });
  if (has('Enseignant'))  db.Incident.belongsTo(db.Enseignant,  { foreignKey: 'idEnseignant',  as: 'enseignant' });
  if (has('AnneeAcademique'))db.Incident.belongsTo(db.AnneeAcademique, { foreignKey: 'idAnnee', as: 'annee' });
  if (has('Sanction'))    db.Incident.hasOne(db.Sanction,       { foreignKey: 'idIncident',    as: 'sanction' });
}

// ─── SANCTION ──────────────────────────────────────────────────────────────
if (has('Sanction') && has('Incident')) {
  db.Sanction.belongsTo(db.Incident, { foreignKey: 'idIncident', as: 'incident' });
}

// ─── MESSAGE ───────────────────────────────────────────────────────────────
if (has('Message')) {
  if (has('Admin'))  db.Message.belongsTo(db.Admin,  { foreignKey: 'idExpediteur',  as: 'expediteur' });
  if (has('Admin'))  db.Message.belongsTo(db.Admin,  { foreignKey: 'idDestinataire',as: 'destinataire' });
  if (has('Parent')) db.Message.belongsTo(db.Parent, { foreignKey: 'idParent',      as: 'parent' });
  db.Message.belongsTo(db.Message, { foreignKey: 'reponse_a_id', as: 'reponseA' });
  db.Message.hasMany(db.Message,   { foreignKey: 'reponse_a_id', as: 'reponses' });
}

// ─── USER ──────────────────────────────────────────────────────────────────
if (has('User')) {
  if (has('Parent'))   db.User.hasOne(db.Parent,   { foreignKey: 'user_id',   as: 'parent' });
  if (has('Enseignant'))db.User.hasOne(db.Enseignant,{ foreignKey: 'user_id', as: 'enseignant' });
  if (has('Personne')) db.User.belongsTo(db.Personne,{ foreignKey: 'person_id',as: 'personne' });
}

// ─── Export ────────────────────────────────────────────────────────────────
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;