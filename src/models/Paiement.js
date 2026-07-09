const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Paiement extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'matricule', targetKey: 'matricule' });
      this.belongsTo(models.User, { foreignKey: 'enregistre_par_id', as: 'EnregistrePar' });
    }
  }

  Paiement.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matricule: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idAnnee: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    mode_paiement: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'especes',
      validate: { isIn: [['especes', 'mobile_money', 'virement', 'cheque']] },
    },
    statut: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'paye',
      validate: { isIn: [['paye', 'partiel', 'annule']] },
    },
    numero_recu: DataTypes.STRING(50),
    operation_ID: DataTypes.STRING(50),
    commentaire: DataTypes.STRING(255),
    recu_url: DataTypes.STRING(255),
    date_paiement: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    enregistre_par_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Paiement',
    tableName: 'Paiements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Paiement;
};
