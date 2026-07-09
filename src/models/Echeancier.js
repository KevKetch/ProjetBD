// src/models/Echeancier.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Echeancier extends Model {
    static associate(models) {
      this.belongsTo(models.Frais, {
        foreignKey: 'idFrais',
        as: 'frais'
      });
      this.belongsTo(models.AnneeAcademique, {
        foreignKey: 'idAnnee',
        as: 'annee'
      });
      this.hasMany(models.Paiement, {
        foreignKey: 'idEcheancier',
        as: 'paiements'
      });
    }

    // Calculer le montant total restant pour un élève
    async getMontantRestant(matricule) {
      const paiements = await models.Paiement.findAll({
        where: {
          idEcheancier: this.idEcheancier,
          matricule: matricule,
          statut: { [Op.ne]: 'annule' }
        }
      });

      const totalPaye = paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0);
      return parseFloat(this.montant) - totalPaye;
    }

    // Vérifier si la tranche est échue
    isEchue() {
      if (!this.date_echeance) return false;
      return new Date(this.date_echeance) < new Date();
    }

    // Vérifier si la tranche est payée pour un élève
    async isPayee(matricule) {
      const paiements = await models.Paiement.findAll({
        where: {
          idEcheancier: this.idEcheancier,
          matricule: matricule,
          statut: 'paye'
        }
      });

      const totalPaye = paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0);
      return totalPaye >= parseFloat(this.montant);
    }
  }

  Echeancier.init({
    idEcheancier: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idEcheancier'
    },
    libelle: {
      type: DataTypes.STRING(60),
      allowNull: false,
      field: 'libelle'
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'montant',
      validate: { min: 0.01 }
    },
    date_echeance: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_echeance'
    },
    ordre: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      field: 'ordre'
    },
    idFrais: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idFrais'
    },
    idAnnee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idAnnee'
    },
    niveau: {
      type: DataTypes.ENUM('PS', 'MS', 'GS', 'SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'),
      allowNull: true,
      field: 'niveau',
      comment: 'NULL = tous les niveaux'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'Echeancier',
    tableName: 'echeancier',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Echeancier;
};
