const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Enseignant extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.hasMany(models.Note);
      this.hasMany(models.Incident);
    }
  }

  Enseignant.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Enseignant',
  });

  return Enseignant;
};
