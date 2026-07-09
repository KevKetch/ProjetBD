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
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
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

// ================================================================
// ADMIN associations
// ================================================================
db.Admin.hasMany(db.Eleve, {
  foreignKey: 'idAdmin',
  as: 'eleves'
});
db.Admin.hasMany(db.Classe, {
  foreignKey: 'idAdmin',
  as: 'classes'
});
db.Admin.hasMany(db.Matiere, {
  foreignKey: 'idAdmin',
  as: 'matieres'
});
db.Admin.hasMany(db.AnneeAcademique, {
  foreignKey: 'idAdmin',
  as: 'annees'
});
db.Admin.hasMany(db.Trimestre, {
  foreignKey: 'idAdmin',
  as: 'trimestres'
});
db.Admin.hasMany(db.Echeancier, {
  foreignKey: 'idAdmin',
  as: 'echeanciers'
});
db.Admin.hasMany(db.Paiement, {
  foreignKey: 'idAdmin',
  as: 'paiements'
});
db.Admin.hasMany(db.Epreuve, {
  foreignKey: 'idAdmin',
  as: 'epreuves'
});

// ================================================================
// PERSONNE associations
// ================================================================
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
db.Personne.hasMany(db.Eleve, {
  foreignKey: 'idPers',
  as: 'eleves'
});
db.Personne.hasMany(db.Admin, {
  foreignKey: 'idPers',
  as: 'admins'
});

// ================================================================
// ANNEE_ACADEMIQUE associations
// ================================================================
db.AnneeAcademique.hasMany(db.Trimestre, {
  foreignKey: 'idAca',
  as: 'trimestres'
});
db.AnneeAcademique.hasMany(db.Echeancier, {
  foreignKey: 'idAnnee',
  as: 'echeanciers'
});
db.AnneeAcademique.hasMany(db.Paiement, {
  foreignKey: 'idAnnee',
  as: 'paiements'
});
db.AnneeAcademique.hasMany(db.Enseigner, {
  foreignKey: 'idAnnee',
  as: 'enseignements'
});
db.AnneeAcademique.hasMany(db.Frequente, {
  foreignKey: 'idAnnee',
  as: 'frequences'
});
db.AnneeAcademique.hasMany(db.EnseignerMatiere, {
  foreignKey: 'idAnnee',
  as: 'enseignementsMatiere'
});
db.AnneeAcademique.hasMany(db.EmploiDuTemps, {
  foreignKey: 'idAnnee',
  as: 'emploisDuTemps'
});
db.AnneeAcademique.hasMany(db.Incident, {
  foreignKey: 'idAnnee',
  as: 'incidents'
});

// ================================================================
// TRIMESTRE associations
// ================================================================
db.Trimestre.hasMany(db.Sequence, {
  foreignKey: 'idTrimestre',
  as: 'sequences'
});
db.Trimestre.hasMany(db.Epreuve, {
  foreignKey: 'idTrimestre',
  as: 'epreuves'
});
db.Trimestre.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAca',
  as: 'anneeAcademique'
});
db.Trimestre.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});

// ================================================================
// SEQUENCE associations
// ================================================================
db.Sequence.hasMany(db.Note, {
  foreignKey: 'idSequence',
  as: 'notes'
});
db.Sequence.hasMany(db.Bulletin, {
  foreignKey: 'idSequence',
  as: 'bulletins'
});
db.Sequence.belongsTo(db.Trimestre, {
  foreignKey: 'idTrimestre',
  as: 'trimestre'
});
db.Sequence.belongsTo(db.Personne, {
  foreignKey: 'idPers',
  as: 'personne'
});

// ================================================================
// CLASSE associations
// ================================================================
db.Classe.hasMany(db.Eleve, {
  foreignKey: 'idClasse',
  as: 'eleves'
});
db.Classe.hasMany(db.Epreuve, {
  foreignKey: 'idClasse',
  as: 'epreuves'
});
db.Classe.hasMany(db.Enseigner, {
  foreignKey: 'idClasse',
  as: 'enseignements'
});
db.Classe.hasMany(db.Frequente, {
  foreignKey: 'idClasse',
  as: 'frequences'
});
db.Classe.hasMany(db.EnseignerMatiere, {
  foreignKey: 'idClasse',
  as: 'enseignementsMatiere'
});
db.Classe.hasMany(db.EmploiDuTemps, {
  foreignKey: 'idClasse',
  as: 'emploisDuTemps'
});
db.Classe.belongsTo(db.Cycle, {
  foreignKey: 'idCycle',
  as: 'cycle'
});
db.Classe.belongsTo(db.Salle, {
  foreignKey: 'idSalle',
  as: 'salle'
});
db.Classe.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Classe.belongsToMany(db.Matiere, {
  through: db.MatiereClasse,
  foreignKey: 'classe_id',
  otherKey: 'matiere_id',
  as: 'matieres'
});

// ================================================================
// CYCLE associations
// ================================================================
db.Cycle.hasMany(db.Classe, {
  foreignKey: 'idCycle',
  as: 'classes'
});

// ================================================================
// SALLE associations
// ================================================================
db.Salle.hasMany(db.Classe, {
  foreignKey: 'idSalle',
  as: 'classes'
});

// ================================================================
// ELEVE associations
// ================================================================
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
db.Eleve.hasMany(db.Frequente, {
  foreignKey: 'matricule',
  sourceKey: 'matricule',
  as: 'frequences'
});
db.Eleve.belongsTo(db.Classe, {
  foreignKey: 'idClasse',
  as: 'classe'
});
db.Eleve.belongsTo(db.Ville, {
  foreignKey: 'idVilleNaissance',
  as: 'villeNaissance'
});
db.Eleve.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Eleve.belongsTo(db.Personne, {
  foreignKey: 'idPers',
  as: 'personne'
});

// ================================================================
// PARENT associations
// ================================================================
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
db.Parent.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});
db.Parent.hasMany(db.Message, {
  foreignKey: 'idParent',
  as: 'messages'
});

// ================================================================
// ENSEIGNANT associations
// ================================================================
db.Enseignant.hasMany(db.Note, {
  foreignKey: 'idEnseignant',
  as: 'notes'
});
db.Enseignant.hasMany(db.Incident, {
  foreignKey: 'idEnseignant',
  as: 'incidents'
});
db.Enseignant.hasMany(db.Epreuve, {
  foreignKey: 'idEnseignant',
  as: 'epreuves'
});
db.Enseignant.hasMany(db.Enseigner, {
  foreignKey: 'idEnseignant',
  as: 'enseignements'
});
db.Enseignant.hasMany(db.EnseignerMatiere, {
  foreignKey: 'idEnseignant',
  as: 'enseignementsMatiere'
});
db.Enseignant.hasMany(db.EmploiDuTemps, {
  foreignKey: 'idEnseignant',
  as: 'emploisDuTemps'
});
db.Enseignant.belongsTo(db.Personne, {
  foreignKey: 'idPers',
  as: 'personne'
});
db.Enseignant.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Enseignant.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});
db.Enseignant.belongsToMany(db.Matiere, {
  through: db.EnseignerMatiere,
  foreignKey: 'idEnseignant',
  otherKey: 'idMatiere',
  as: 'matieres'
});

// ================================================================
// ENSEIGNER (Teacher ↔ Class assignment)
// ================================================================
db.Enseigner.belongsTo(db.Enseignant, {
  foreignKey: 'idEnseignant',
  as: 'enseignant'
});
db.Enseigner.belongsTo(db.Classe, {
  foreignKey: 'idClasse',
  as: 'classe'
});
db.Enseigner.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});

// ================================================================
// FREQUENTE (Student attends Class)
// ================================================================
db.Frequente.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  as: 'eleve'
});
db.Frequente.belongsTo(db.Classe, {
  foreignKey: 'idClasse',
  as: 'classe'
});
db.Frequente.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});

// ================================================================
// MATIERE associations
// ================================================================
db.Matiere.hasMany(db.Epreuve, {
  foreignKey: 'idMatiere',
  as: 'epreuves'
});
db.Matiere.hasMany(db.Note, {
  foreignKey: 'idMatiere',
  as: 'notes'
});
db.Matiere.hasMany(db.EnseignerMatiere, {
  foreignKey: 'idMatiere',
  as: 'enseignements'
});
db.Matiere.hasMany(db.EmploiDuTemps, {
  foreignKey: 'idMatiere',
  as: 'emploisDuTemps'
});
db.Matiere.hasMany(db.BanqueEpreuves, {
  foreignKey: 'idMatiere',
  as: 'banqueEpreuves'
});
db.Matiere.hasMany(db.BulletinLigne, {
  foreignKey: 'idMatiere',
  as: 'bulletinLignes'
});
db.Matiere.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Matiere.belongsToMany(db.Classe, {
  through: db.MatiereClasse,
  foreignKey: 'matiere_id',
  otherKey: 'classe_id',
  as: 'classes'
});
db.Matiere.belongsToMany(db.Enseignant, {
  through: db.EnseignerMatiere,
  foreignKey: 'idMatiere',
  otherKey: 'idEnseignant',
  as: 'enseignants'
});

// ================================================================
// MATIERE_CLASSE (Junction table)
// ================================================================
db.MatiereClasse.belongsTo(db.Matiere, {
  foreignKey: 'matiere_id',
  as: 'matiere'
});
db.MatiereClasse.belongsTo(db.Classe, {
  foreignKey: 'classe_id',
  as: 'classe'
});
db.MatiereClasse.belongsTo(db.Enseignant, {
  foreignKey: 'enseignant_id',
  as: 'enseignant'
});

// ================================================================
// ENSEIGNER_MATIERE (Teacher teaches Subject in Class)
// ================================================================
db.EnseignerMatiere.belongsTo(db.Enseignant, {
  foreignKey: 'idEnseignant',
  as: 'enseignant'
});
db.EnseignerMatiere.belongsTo(db.Matiere, {
  foreignKey: 'idMatiere',
  as: 'matiere'
});
db.EnseignerMatiere.belongsTo(db.Classe, {
  foreignKey: 'idClasse',
  as: 'classe'
});
db.EnseignerMatiere.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});

// ================================================================
// NATURE_EPREUVE associations
// ================================================================
db.NatureEpreuve.hasMany(db.Epreuve, {
  foreignKey: 'idNature',
  as: 'epreuves'
});

// ================================================================
// EPREUVE associations
// ================================================================
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
db.Epreuve.belongsTo(db.Enseignant, {
  foreignKey: 'idEnseignant',
  as: 'enseignant'
});
db.Epreuve.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Epreuve.hasMany(db.EpreuveNote, {
  foreignKey: 'idEpreuve',
  as: 'notes'
});

// ================================================================
// EPREUVE_NOTE associations
// ================================================================
db.EpreuveNote.belongsTo(db.Epreuve, {
  foreignKey: 'idEpreuve',
  as: 'epreuve'
});
db.EpreuveNote.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  as: 'eleve'
});

// ================================================================
// NOTE associations
// ================================================================
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
  foreignKey: 'idEnseignant',
  as: 'enseignant'
});
db.Note.belongsTo(db.Epreuve, {
  foreignKey: 'idEpreuve',
  as: 'epreuve'
});

// ================================================================
// BULLETIN associations
// ================================================================
db.Bulletin.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  targetKey: 'matricule',
  as: 'eleve'
});
db.Bulletin.belongsTo(db.Sequence, {
  foreignKey: 'idSequence',
  as: 'sequence'
});
db.Bulletin.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Bulletin.hasMany(db.BulletinLigne, {
  foreignKey: 'idBulletin',
  as: 'lignes'
});

// ================================================================
// BULLETIN_LIGNE associations
// ================================================================
db.BulletinLigne.belongsTo(db.Bulletin, {
  foreignKey: 'idBulletin',
  as: 'bulletin'
});
db.BulletinLigne.belongsTo(db.Matiere, {
  foreignKey: 'idMatiere',
  as: 'matiere'
});

// ================================================================
// FRAIS associations
// ================================================================
db.Frais.hasMany(db.Echeancier, {
  foreignKey: 'idFrais',
  as: 'echeanciers'
});

// ================================================================
// ECHEANCIER associations
// ================================================================
db.Echeancier.belongsTo(db.Frais, {
  foreignKey: 'idFrais',
  as: 'frais'
});
db.Echeancier.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});
db.Echeancier.hasMany(db.Paiement, {
  foreignKey: 'idEcheancier',
  as: 'paiements'
});

// ================================================================
// PAIEMENT associations
// ================================================================
db.Paiement.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  targetKey: 'matricule',
  as: 'eleve'
});
db.Paiement.belongsTo(db.Echeancier, {
  foreignKey: 'idEcheancier',
  as: 'echeancier'
});
db.Paiement.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});
db.Paiement.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});

// ================================================================
// PRESENCE associations
// ================================================================
db.Presence.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  targetKey: 'matricule',
  as: 'eleve'
});

// ================================================================
// RETARD associations
// ================================================================
db.Retard.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  targetKey: 'matricule',
  as: 'eleve'
});

// ================================================================
// TYPE_INCIDENT associations
// ================================================================
db.TypeIncident.hasMany(db.Incident, {
  foreignKey: 'idTypeIncident',
  as: 'incidents'
});

// ================================================================
// INCIDENT associations
// ================================================================
db.Incident.belongsTo(db.Eleve, {
  foreignKey: 'matricule',
  targetKey: 'matricule',
  as: 'eleve'
});
db.Incident.belongsTo(db.TypeIncident, {
  foreignKey: 'idTypeIncident',
  as: 'typeIncident'
});
db.Incident.belongsTo(db.Enseignant, {
  foreignKey: 'idEnseignant',
  as: 'enseignant'
});
db.Incident.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});
db.Incident.hasOne(db.Sanction, {
  foreignKey: 'idIncident',
  as: 'sanction'
});

// ================================================================
// SANCTION associations
// ================================================================
db.Sanction.belongsTo(db.Incident, {
  foreignKey: 'idIncident',
  as: 'incident'
});

// ================================================================
// EMPLOI_DU_TEMPS associations
// ================================================================
db.EmploiDuTemps.belongsTo(db.Classe, {
  foreignKey: 'idClasse',
  as: 'classe'
});
db.EmploiDuTemps.belongsTo(db.Matiere, {
  foreignKey: 'idMatiere',
  as: 'matiere'
});
db.EmploiDuTemps.belongsTo(db.Enseignant, {
  foreignKey: 'idEnseignant',
  as: 'enseignant'
});
db.EmploiDuTemps.belongsTo(db.AnneeAcademique, {
  foreignKey: 'idAnnee',
  as: 'annee'
});

// ================================================================
// MESSAGE associations
// ================================================================
db.Message.belongsTo(db.Admin, {
  foreignKey: 'idExpediteur',
  as: 'expediteur'
});
db.Message.belongsTo(db.Admin, {
  foreignKey: 'idDestinataire',
  as: 'destinataire'
});
db.Message.belongsTo(db.Parent, {
  foreignKey: 'idParent',
  as: 'parent'
});
db.Message.belongsTo(db.Message, {
  foreignKey: 'reponse_a_id',
  as: 'reponseA'
});
db.Message.hasMany(db.Message, {
  foreignKey: 'reponse_a_id',
  as: 'reponses'
});

// ================================================================
// BANQUE_EPREUVES associations
// ================================================================
db.BanqueEpreuves.belongsTo(db.Matiere, {
  foreignKey: 'idMatiere',
  as: 'matiere'
});
db.BanqueEpreuves.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});

// ================================================================
// VILLE associations
// ================================================================
db.Ville.hasMany(db.Eleve, {
  foreignKey: 'idVilleNaissance',
  as: 'eleves'
});

// ================================================================
// USER associations
// ================================================================
db.User.hasOne(db.Parent, {
  foreignKey: 'user_id',
  as: 'parent'
});
db.User.hasOne(db.Enseignant, {
  foreignKey: 'user_id',
  as: 'enseignant'
});
db.User.belongsTo(db.Personne, {
  foreignKey: 'person_id',
  as: 'personne'
});

// ================================================================
// LOG_ACTIONS associations
// ================================================================
db.LogAction.belongsTo(db.Admin, {
  foreignKey: 'idAdmin',
  as: 'admin'
});

// ================================================================
// Export
// ================================================================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;