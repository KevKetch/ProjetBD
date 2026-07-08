const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TypeIncident extends Model {
    static associate(models) {
      this.hasMany(models.Incident);
    }
  }

  TypeIncident.init({
    nom: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TypeIncident',
  });

  return TypeIncident;
};
