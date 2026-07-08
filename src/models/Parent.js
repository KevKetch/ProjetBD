const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Parent extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.hasMany(models.Eleve, { foreignKey: 'parent_id' });
    }
  }

  Parent.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Parent',
  });

  return Parent;
};
