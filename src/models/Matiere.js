const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Matiere extends Model {
    static associate(models) {
      // Pas de relation directe dans ce module
    }
  }

  Matiere.init({
    nom: DataTypes.STRING,
    coefficient: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Matiere',
  });

  return Matiere;
};
