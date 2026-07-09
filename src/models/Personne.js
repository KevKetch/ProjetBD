// src/models/Personne.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Personne extends Model {
    static associate(models) {
      // Associations are defined manually in models/index.js
    }
  }

  Personne.init({
    idPers: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idPers'
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'nom'
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'prenom'
    },
    dateNaissance: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'dateNaissance'
    },
    lieuNaissance: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'lieuNaissance'
    },
    sexe: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      field: 'sexe'
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'adresse'
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'telephone'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'email'
    },
    photoURL: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'photoURL'
    }
  }, {
    sequelize,
    modelName: 'Personne',
    tableName: 'personne',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Personne;
};
