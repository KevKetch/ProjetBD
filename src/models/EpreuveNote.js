// src/models/EpreuveNote.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class EpreuveNote extends Model {
    static associate(models) {
      this.belongsTo(models.Epreuve, {
        foreignKey: 'idEpreuve',
        as: 'epreuve'
      });
      this.belongsTo(models.Eleve, {
        foreignKey: 'matricule',
        as: 'eleve'
      });
    }
  }

  EpreuveNote.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    idEpreuve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idEpreuve'
    },
    matricule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'matricule'
    },
    note: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true,
      field: 'note',
      validate: { min: 0, max: 20 }
    },
    appreciation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'appreciation'
    }
  }, {
    sequelize,
    modelName: 'EpreuveNote',
    tableName: 'epreuve_notes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return EpreuveNote;
};
