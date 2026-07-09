const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Parent extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'matricule', targetKey: 'matricule' });
    }
  }

  Parent.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idParent'
    },
    nom: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('nom') || 'Parent'; }
    },
    prenom: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('prenom') || ''; }
    },
    telephone: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('telephone') || ''; }
    },
    email: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('email') || ''; }
    },
    idPers: {
      type: DataTypes.INTEGER,
      field: 'idPers',
      defaultValue: 1
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      field: 'idAdmin',
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Parent',
  });

  return Parent;
};
