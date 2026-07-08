const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sequence extends Model {
    static associate(models) {
      this.hasMany(models.Note);
      this.hasMany(models.Bulletin);
    }
  }

  Sequence.init({
    libelle: DataTypes.STRING,
    date_debut: DataTypes.DATEONLY,
    date_fin: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Sequence',
  });

  return Sequence;
};
