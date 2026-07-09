// src/models/AnneeAcademique.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AnneeAcademique extends Model {
    static associate(models) {
      // Associations are defined manually in models/index.js
    }
  }

  AnneeAcademique.init({
    idAnnee: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idAnnee'
    },
    libelle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'libelle',
      validate: { notEmpty: true }
    },
    statut: {
      type: DataTypes.ENUM('actif', 'inactif'),
      allowNull: true,
      defaultValue: 'actif',
      field: 'statut'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idAdmin',
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'AnneeAcademique',
    tableName: 'annee_academique',
    timestamps: false
  });

  return AnneeAcademique;
};
