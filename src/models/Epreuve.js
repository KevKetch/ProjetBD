// src/models/Epreuve.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Epreuve extends Model {
    static associate(models) {
      this.belongsTo(models.Trimestre, {
        foreignKey: 'idTrimestre',
        as: 'trimestre'
      });
      this.belongsTo(models.NatureEpreuve, {
        foreignKey: 'idNature',
        as: 'nature'
      });
      this.belongsTo(models.Matiere, {
        foreignKey: 'idMatiere',
        as: 'matiere'
      });
      this.belongsTo(models.Classe, {
        foreignKey: 'idClasse',
        as: 'classe'
      });
      this.belongsTo(models.Personne, {
        foreignKey: 'idPers',
        as: 'enseignant'
      });
      this.hasMany(models.EpreuveNote, {
        foreignKey: 'idEpreuve',
        as: 'notes'
      });
    }
  }

  Epreuve.init({
    idEpreuve: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idEpreuve'
    },
    idTrimestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idTrimestre'
    },
    idNature: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idNature'
    },
    idMatiere: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idMatiere'
    },
    idClasse: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idClasse'
    },
    idPers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idPers'
    },
    titre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'titre',
      validate: { notEmpty: true }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    duree_minutes: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'duree_minutes',
      validate: { min: 1 }
    },
    coefficient: {
      type: DataTypes.FLOAT,
      defaultValue: 1.00,
      field: 'coefficient',
      validate: { min: 0.5, max: 5 }
    },
    total_points: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 20.00,
      field: 'total_points',
      validate: { min: 1 }
    },
    date_epreuve: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_epreuve'
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published'
    },
    date_publication: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_publication'
    },
    fichier_sujet: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'fichier_sujet'
    },
    fichier_correction: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'fichier_correction'
    }
  }, {
    sequelize,
    modelName: 'Epreuve',
    tableName: 'epreuve',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });

  return Epreuve;
};
