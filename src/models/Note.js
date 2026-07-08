const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Note extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'eleve_matricule', targetKey: 'matricule' });
      this.belongsTo(models.Matiere, { foreignKey: 'matiere_id' });
      this.belongsTo(models.Sequence, { foreignKey: 'sequence_id' });
      this.belongsTo(models.Enseignant, { foreignKey: 'enseignant_id' });
    }
  }

  Note.init({
    valeur: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      validate: { min: 0, max: 20 },
    },
    appreciation: DataTypes.STRING,
    date_saisie: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Note',
  });

  return Note;
};
