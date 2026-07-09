// src/models/NatureEpreuve.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class NatureEpreuve extends Model {
    static associate(models) {
      this.hasMany(models.Epreuve, {
        foreignKey: 'idNature',
        as: 'epreuves'
      });
    }
  }

  NatureEpreuve.init({
    idNature: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idNature'
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'code'
    },
    libelle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'libelle'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    coefficient: {
      type: DataTypes.FLOAT,
      defaultValue: 1.00,
      field: 'coefficient',
      validate: { min: 0.5, max: 5 }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'NatureEpreuve',
    tableName: 'nature_epreuve',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return NatureEpreuve;
};
