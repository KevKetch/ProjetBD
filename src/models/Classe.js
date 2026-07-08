const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Classe extends Model {
    static associate(models) {
      this.hasMany(models.Eleve, { foreignKey: 'classe_id' });
      // Niveau and Salle models are not defined in this project.
      // Remove these associations until the corresponding models are added.
    }
  }

  Classe.init({
    libelle: DataTypes.STRING,
    capacite: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Classe',
  });

  return Classe;
};
