// src/models/Paiement.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Paiement extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, {
        foreignKey: 'matricule',
          targetKey: 'matricule',
          as: 'eleve'
      });
      this.belongsTo(models.Echeancier, {
        foreignKey: 'idEcheancier',
          as: 'echeancier'
      });
      this.belongsTo(models.Admin, {
        foreignKey: 'idAdmin',
          as: 'admin'
      });
      this.belongsTo(models.AnneeAcademique, {
        foreignKey: 'idAnnee',
          as: 'annee'
      });
    }
  }

  Paiement.init({
    idPaiement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idPaiement'
    },
    matricule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'matricule'
    },
    idAnnee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idAnnee'
    },
    idEcheancier: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idEcheancier'
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                field: 'montant',
                validate: { min: 0.01 }
    },
    mode_paiement: {
      type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: 'especes',
                  field: 'mode_paiement',
                  validate: { isIn: [['especes', 'mobile_money', 'virement', 'cheque']] }
    },
    statut: {
      type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'paye',
                  field: 'statut',
                  validate: { isIn: [['paye', 'partiel', 'annule']] }
    },
    numero_recu: {
      type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                field: 'numero_recu'
    },
    operation_ID: {
      type: DataTypes.STRING(50),
                allowNull: true,
                field: 'operation_ID'
    },
    commentaire: {
      type: DataTypes.STRING(255),
                allowNull: true,
                field: 'commentaire'
    },
    date_paiement: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_paiement'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'idAdmin'
    }
  }, {
    sequelize,
    modelName: 'Paiement',
    tableName: 'paiement',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Paiement;
};
