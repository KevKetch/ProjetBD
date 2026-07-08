const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Eleve extends Model {
    static associate(models) {
      this.belongsTo(models.Classe, { foreignKey: 'classe_id' });
      this.belongsTo(models.Parent, { foreignKey: 'parent_id' });
      this.hasMany(models.Note, { foreignKey: 'eleve_matricule', sourceKey: 'matricule' });
      this.hasMany(models.Incident, { foreignKey: 'eleve_matricule', sourceKey: 'matricule' });
      this.hasMany(models.Presence, { foreignKey: 'eleve_matricule', sourceKey: 'matricule' });
      this.hasMany(models.Retard, { foreignKey: 'eleve_matricule', sourceKey: 'matricule' });
      this.hasMany(models.Bulletin, { foreignKey: 'eleve_matricule', sourceKey: 'matricule' });
    }
  }

  Eleve.init({
    matricule: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    date_naissance: DataTypes.DATEONLY,
    lieu_naissance: DataTypes.STRING,
    sexe: DataTypes.ENUM('M', 'F'),
    photo: DataTypes.STRING,
    date_inscription: DataTypes.DATEONLY,
    statut: {
      type: DataTypes.ENUM('actif', 'radie', 'transfere'),
      defaultValue: 'actif',
    },
  }, {
    sequelize,
    modelName: 'Eleve',
    paranoid: true,
  });

  return Eleve;
};
