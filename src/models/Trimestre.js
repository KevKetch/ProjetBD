// src/models/Trimestre.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Trimestre extends Model {
    static associate(models) {
      this.belongsTo(models.AnneeAcademique, {
        foreignKey: 'idAca',
        as: 'anneeAcademique'
      });
      this.belongsTo(models.Admin, {
        foreignKey: 'idAdmin',
        as: 'admin'
      });
      this.hasMany(models.Sequence, {
        foreignKey: 'idTrimestre',
        as: 'sequences'
      });
      this.hasMany(models.Epreuve, {
        foreignKey: 'idTrimestre',
        as: 'epreuves'
      });
    }

    // Méthode pour calculer la période
    getPeriode() {
      return this.periode || `${this.libelle} - ${this.anneeAcademique?.libelle || ''}`;
    }

    // Vérifier si le trimestre est actif (date actuelle dans la période)
    isActive() {
      if (!this.date_debut || !this.date_fin) return false;
      const now = new Date();
      const debut = new Date(this.date_debut);
      const fin = new Date(this.date_fin);
      return now >= debut && now <= fin;
    }
  }

  Trimestre.init({
    idTrimes: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idTrimes'
    },
    libelle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'libelle',
      validate: { notEmpty: true }
    },
    periode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'periode'
    },
    // Pour la compatibilité avec votre base
    date_debut: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_debut'
    },
    date_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_fin'
    },
    idAca: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idAca'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idAdmin',
      defaultValue: 1
    },
    ordre: {
      type: DataTypes.TINYINT,
      allowNull: true,
      field: 'ordre',
      defaultValue: 1,
      validate: { min: 1, max: 3 }
    }
  }, {
    sequelize,
    modelName: 'Trimestre',
    tableName: 'trimestre',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Trimestre;
};
