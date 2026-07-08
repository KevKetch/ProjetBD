const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Bulletin extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'eleve_matricule', targetKey: 'matricule' });
      this.belongsTo(models.Sequence, { foreignKey: 'sequence_id' });
    }
  }

  Bulletin.init({
    moyenne_generale: DataTypes.DECIMAL(4, 2),
    appreciation: DataTypes.TEXT,
    pdf_path: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Bulletin',
  });

  return Bulletin;
};
