const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Presence extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'eleve_matricule', targetKey: 'matricule' });
    }
  }

  Presence.init({
    date: DataTypes.DATEONLY,
    statut: {
      type: DataTypes.ENUM('present', 'absent', 'justifie'),
      allowNull: false,
    },
    motif_absence: DataTypes.STRING,
    piece_jointe: DataTypes.STRING,
    justifiee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Presence',
  });

  return Presence;
};
