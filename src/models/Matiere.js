const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Matiere extends Model {
    static associate(models) {}
  }

  Matiere.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idMatiere',
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'libelle',
    },
    coefficient: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    },
    description: DataTypes.TEXT,
    idAdmin: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'Matiere',
    tableName: 'Matieres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Matiere;
};
