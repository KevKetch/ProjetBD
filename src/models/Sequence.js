// src/models/Sequence.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sequence extends Model {
    static associate(models) {
      this.belongsTo(models.Trimestre, {
        foreignKey: 'idTrimestre',
        as: 'trimestre'
      });
      this.belongsTo(models.Personne, {
        foreignKey: 'idPers',
        as: 'personne'
      });
      this.hasMany(models.Note, {
        foreignKey: 'idSequence',
        as: 'notes'
      });
      this.hasMany(models.Bulletin, {
        foreignKey: 'idSequence',
        as: 'bulletins'
      });
    }
  }

  Sequence.init({
    idSequence: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idSequence'
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'libelle',
      validate: { notEmpty: true }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    idTrimestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idTrimestre'
    },
    idPers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idPers',
      defaultValue: 1
    },
    date_debut: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_debut'
    },
    date_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_fin'
    }
  }, {
    sequelize,
    modelName: 'Sequence',
    tableName: 'sequences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Sequence;
};
