// src/models/MatiereClasse.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class MatiereClasse extends Model {
    static associate(models) {
      this.belongsTo(models.Matiere, { foreignKey: 'matiere_id' });
      this.belongsTo(models.Classe, { foreignKey: 'classe_id' });
      this.belongsTo(models.Enseignant, { foreignKey: 'enseignant_id' });
    }
  }

  MatiereClasse.init({
    matiere_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Matieres',
        key: 'idMatiere'
      }
    },
    classe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Classes',
        key: 'idClasse'
      }
    },
    coefficient: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
      validate: {
        min: 0.5,
        max: 5
      }
    },
    enseignant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Enseignants',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'MatiereClasse',
    tableName: 'MatiereClasse',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return MatiereClasse;
};
