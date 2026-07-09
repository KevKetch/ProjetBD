// src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ================================================================
// Load all models
// ================================================================
fs.readdirSync(__dirname)
.filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  );
})
.forEach(file => {
  const modelFactory = require(path.join(__dirname, file));
  if (typeof modelFactory === 'function') {
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
});

// ================================================================
// Define associations
// ================================================================
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ================================================================
// Extra associations (for models that need them)
// ================================================================

// Admin associations
db.Admin.hasMany(db.Eleve, { foreignKey: 'idAdmin', as: 'eleves' });
db.Admin.hasMany(db.Classe, { foreignKey: 'idAdmin', as: 'classes' });
db.Admin.hasMany(db.Matiere, { foreignKey: 'idAdmin', as: 'matieres' });
db.Admin.hasMany(db.AnneeAcademique, { foreignKey: 'idAdmin', as: 'annees' });
db.Admin.hasMany(db.Trimestre, { foreignKey: 'idAdmin', as: 'trimestres' });

// AnneeAcademique associations
db.AnneeAcademique.hasMany(db.Trimestre, {
  foreignKey: 'idAca',
    as: 'trimestres'
});

// Trimestre associations
db.Trimestre.hasMany(db.Sequence, {
  foreignKey: 'idTrimestre',
    as: 'sequences'
});
db.Trimestre.hasMany(db.Epreuve, {
  foreignKey: 'idTrimestre',
    as: 'epreuves'
});

// Sequence associations
db.Sequence.hasMany(db.Note, {
  foreignKey: 'idSequence',
    as: 'notes'
});
db.Sequence.hasMany(db.Bulletin, {
  foreignKey: 'idSequence',
    as: 'bulletins'
});

// Matiere associations (already defined in Matiere.js)
// Adding additional associations
db.Matiere.belongsToMany(db.Classe, {
  through: db.MatiereClasse,
  foreignKey: 'matiere_id',
    otherKey: 'classe_id',
    as: 'classes'
});
db.Matiere.belongsToMany(db.Enseignant, {
  through: 'MatiereEnseignant',
  foreignKey: 'matiere_id',
    otherKey: 'enseignant_id',
    as: 'enseignants'
});
db.Matiere.hasMany(db.Epreuve, {
  foreignKey: 'idMatiere',
    as: 'epreuves'
});

// Classe associations
db.Classe.belongsToMany(db.Matiere, {
  through: db.MatiereClasse,
  foreignKey: 'classe_id',
    otherKey: 'matiere_id',
    as: 'matieres'
});
db.Classe.hasMany(db.Eleve, {
  foreignKey: 'classe_id',
    as: 'eleves'
});
db.Classe.hasMany(db.Epreuve, {
  foreignKey: 'idClasse',
    as: 'epreuves'
});

// MatiereClasse associations (already defined in MatiereClasse.js)
db.MatiereClasse.belongsTo(db.Matiere, { foreignKey: 'matiere_id', as: 'matiere' });
db.MatiereClasse.belongsTo(db.Classe, { foreignKey: 'classe_id', as: 'classe' });
db.MatiereClasse.belongsTo(db.Enseignant, { foreignKey: 'enseignant_id', as: 'enseignant' });

// Eleve associations
db.Eleve.hasMany(db.Parent, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'parents'
});
db.Eleve.hasMany(db.Paiement, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'paiements'
});
db.Eleve.hasMany(db.Note, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'notes'
});
db.Eleve.hasMany(db.EpreuveNote, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'epreuveNotes'
});
db.Eleve.hasMany(db.Bulletin, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'bulletins'
});
db.Eleve.hasMany(db.Incident, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'incidents'
});
db.Eleve.hasMany(db.Presence, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'presences'
});
db.Eleve.hasMany(db.Retard, {
  foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'retards'
});

// Parent associations
db.Parent.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});
db.Parent.belongsTo(db.Personne, {
  foreignKey: 'idPers',
    as: 'personne'
});
db.Parent.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
    as: 'admin'
});

// Personne associations
db.Personne.hasMany(db.Parent, {
  foreignKey: 'idPers',
    as: 'parents'
});
db.Personne.hasMany(db.Enseignant, {
  foreignKey: 'idPers',
    as: 'enseignants'
});
db.Personne.hasMany(db.Epreuve, {
  foreignKey: 'idPers',
    as: 'epreuvesCrees'
});
db.Personne.hasMany(db.Sequence, {
  foreignKey: 'idPers',
    as: 'sequences'
});

// Enseignant associations
db.Enseignant.belongsTo(db.User, {
  foreignKey: 'user_id',
    as: 'user'
});
db.Enseignant.belongsTo(db.Personne, {
  foreignKey: 'idPers',
    as: 'personne'
});
db.Enseignant.hasMany(db.Note, {
  foreignKey: 'enseignant_id',
    as: 'notes'
});
db.Enseignant.hasMany(db.Incident, {
  foreignKey: 'enseignant_id',
    as: 'incidents'
});
db.Enseignant.belongsToMany(db.Matiere, {
  through: 'MatiereEnseignant',
  foreignKey: 'enseignant_id',
    otherKey: 'matiere_id',
    as: 'matieres'
});

// Epreuve associations
db.Epreuve.belongsTo(db.Trimestre, {
  foreignKey: 'idTrimestre',
    as: 'trimestre'
});
db.Epreuve.belongsTo(db.NatureEpreuve, {
  foreignKey: 'idNature',
    as: 'nature'
});
db.Epreuve.belongsTo(db.Matiere, {
  foreignKey: 'idMatiere',
    as: 'matiere'
});
db.Epreuve.belongsTo(db.Classe, {
  foreignKey: 'idClasse',
    as: 'classe'
});
db.Epreuve.belongsTo(db.Personne, {
  foreignKey: 'idPers',
    as: 'enseignant'
});
db.Epreuve.hasMany(db.EpreuveNote, {
  foreignKey: 'idEpreuve',
    as: 'notes'
});

// EpreuveNote associations
db.EpreuveNote.belongsTo(db.Epreuve, {
  foreignKey: 'idEpreuve',
    as: 'epreuve'
});
db.EpreuveNote.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    as: 'eleve'
});

// NatureEpreuve associations
db.NatureEpreuve.hasMany(db.Epreuve, {
  foreignKey: 'idNature',
    as: 'epreuves'
});

// Note associations
db.Note.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});
db.Note.belongsTo(db.Matiere, {
  foreignKey: 'idMatiere',
    as: 'matiere'
});
db.Note.belongsTo(db.Sequence, {
  foreignKey: 'idSequence',
    as: 'sequence'
});
db.Note.belongsTo(db.Enseignant, {
  foreignKey: 'enseignant_id',
    as: 'enseignant'
});

// Bulletin associations
db.Bulletin.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});
db.Bulletin.belongsTo(db.Sequence, {
  foreignKey: 'idSequence',
    as: 'sequence'
});

// Paiement associations
db.Paiement.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});
db.Paiement.belongsTo(db.User, {
  foreignKey: 'enregistre_par_id',
    as: 'enregistrePar'
});

// Incident associations
db.Incident.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});
db.Incident.belongsTo(db.TypeIncident, {
  foreignKey: 'type_incident_id',
    as: 'typeIncident'
});
db.Incident.belongsTo(db.Enseignant, {
  foreignKey: 'enseignant_id',
    as: 'enseignant'
});
db.Incident.hasOne(db.Sanction, {
  foreignKey: 'incident_id',
    as: 'sanction'
});

// Sanction associations
db.Sanction.belongsTo(db.Incident, {
  foreignKey: 'incident_id',
    as: 'incident'
});

// Presence associations
db.Presence.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});

// Retard associations
db.Retard.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
    targetKey: 'matricule',
    as: 'eleve'
});

// User associations
db.User.belongsToMany(db.Role, {
  through: 'UserRoles',
  foreignKey: 'UserId',
    otherKey: 'RoleId'
});
db.User.hasOne(db.Parent, {
  foreignKey: 'user_id',
    as: 'parent'
});
db.User.hasOne(db.Enseignant, {
  foreignKey: 'user_id',
    as: 'enseignant'
});

// Role associations
db.Role.belongsToMany(db.User, {
  through: 'UserRoles',
  foreignKey: 'RoleId',
    otherKey: 'UserId'
});

// TypeIncident associations
db.TypeIncident.hasMany(db.Incident, {
  foreignKey: 'type_incident_id',
    as: 'incidents'
});

// ================================================================
// Export
// ================================================================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
