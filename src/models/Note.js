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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idNote'
    },
    valeur: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      field: 'note',
      validate: { min: 0, max: 20 },
    },
    appreciation: DataTypes.STRING,
    date_saisie: {
      type: DataTypes.DATEONLY,
      field: 'created_at'
    },
  }, {
    sequelize,
    modelName: 'Note',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Note;
};
