const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class Admin extends Model {
    static associate(models) {
      this.hasMany(models.Eleve, { foreignKey: 'idAdmin' });
    }
    async comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  Admin.init({
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING(100), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    actif: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    typeAdmin: { type: DataTypes.SMALLINT, allowNull: false },
    mobile: DataTypes.STRING(15),
    alanyaID: DataTypes.STRING(15),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admin',
    timestamps: false,
    hooks: {
      beforeCreate: async (admin) => {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    }
  });

  return Admin;
};
