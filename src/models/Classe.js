const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Classe extends Model {
    static associate(models) {
      // Pas de relation directe FK depuis Eleves vers Classes dans le schéma du prof
    }
  }

  Classe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idClasse',
    },
    libelle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    idCycle: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'Classe',
    tableName: 'Classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Classe;
};
