const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, { through: 'UserRoles' });
      this.hasOne(models.Parent, { foreignKey: 'user_id' });
      this.hasOne(models.Enseignant, { foreignKey: 'user_id' });
    }

    async comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  });

  return User;
};
