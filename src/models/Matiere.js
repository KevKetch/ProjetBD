// src/models/Matiere.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Matiere extends Model {
    static associate(models) {
      // Relations many-to-many avec Classe via MatiereClasse
      this.belongsToMany(models.Classe, {
        through: 'MatiereClasse',
        as: 'classes',
        foreignKey: 'matiere_id'
      });

      // Relations many-to-many avec Enseignant via MatiereEnseignant
      this.belongsToMany(models.Enseignant, {
        through: 'MatiereEnseignant',
        as: 'enseignants',
        foreignKey: 'matiere_id'
      });

      // Une matière peut avoir plusieurs épreuves
      this.hasMany(models.Epreuve, {
        as: 'examens',
        foreignKey: 'matiere_id'
      });

      // Une matière peut avoir plusieurs notes
      this.hasMany(models.Note, {
        as: 'notes',
        foreignKey: 'matiere_id'
      });
    }
  }

  Matiere.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idMatiere'
    },
    nom: {
      type: DataTypes.STRING(100),
               allowNull: false,
               field: 'libelle',
               validate: {
                 notEmpty: { msg: 'Le nom de la matière est requis' }
               }
    },
    code: {
      type: DataTypes.STRING(20),
               allowNull: true,
               unique: true,
               field: 'codeMatiere'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    coefficient: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
        validate: {
          min: 0.5,
          max: 5
        }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
        field: 'actif'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
        field: 'idAdmin'
    }
  }, {
    sequelize,
    modelName: 'Matiere',
    tableName: 'Matieres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });

  return Matiere;
};
