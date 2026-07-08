const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Incident extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'eleve_matricule', targetKey: 'matricule' });
      this.belongsTo(models.TypeIncident, { foreignKey: 'type_incident_id' });
      this.belongsTo(models.Enseignant, { foreignKey: 'enseignant_id' });
      this.hasOne(models.Sanction, { foreignKey: 'incident_id' });
    }
  }

  Incident.init({
    date: DataTypes.DATE,
    description: DataTypes.TEXT,
    gravite: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    statut: {
      type: DataTypes.ENUM('signale', 'traite', 'clos'),
      defaultValue: 'signale',
    },
  }, {
    sequelize,
    modelName: 'Incident',
  });

  return Incident;
};
