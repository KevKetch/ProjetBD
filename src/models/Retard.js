const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Retard extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'eleve_matricule', targetKey: 'matricule' });
    }
  }

  Retard.init({
    date: DataTypes.DATE,
    duree: DataTypes.INTEGER, // en minutes
    motif: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Retard',
  });

  return Retard;
};
