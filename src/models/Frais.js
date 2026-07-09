// src/models/Frais.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Frais extends Model {
    static associate(models) {
      this.hasMany(models.Echeancier, {
        foreignKey: 'idFrais',
        as: 'echeanciers'
      });
    }
  }

  Frais.init({
    idFrais: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idFrais'
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: 'code'
    },
    libelle: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: 'libelle'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    modelName: 'Frais',
    tableName: 'frais',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Frais;
};
