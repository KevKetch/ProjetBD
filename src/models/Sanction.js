const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sanction extends Model {
    static associate(models) {
      this.belongsTo(models.Incident, { foreignKey: 'incident_id' });
    }
  }

  Sanction.init({
    type_sanction: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Sanction',
  });

  return Sanction;
};
