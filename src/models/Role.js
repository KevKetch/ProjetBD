const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, { through: 'UserRoles' });
    }
  }

  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, { sequelize, modelName: 'Role' });

  return Role;
};
