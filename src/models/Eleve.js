const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Eleve extends Model {
    static associate(models) {
      // Pas de FK vers Classes dans la table Eleves du professeur
      // La liaison Eleve ↔ Parent se fait via 'matricule' dans la table Parents
      this.hasMany(models.Parent, { foreignKey: 'matricule', sourceKey: 'matricule', as: 'Parents' });
    }
  }

  Eleve.init({
    matricule: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    prenom: DataTypes.STRING(60),
    date_naissance: {
      type: DataTypes.DATEONLY,
      field: 'dateNaissance',
    },
    lieu_naissance: {
      type: DataTypes.STRING(30),
      field: 'lieuNaissance',
    },
    sexe: {
      type: DataTypes.SMALLINT,
      get() {
        const val = this.getDataValue('sexe');
        return val === 1 ? 'M' : val === 2 ? 'F' : val;
      },
      set(val) {
        if (val === 'M') this.setDataValue('sexe', 1);
        else if (val === 'F') this.setDataValue('sexe', 2);
        else this.setDataValue('sexe', val);
      }
    },
    classe_id: {
      type: DataTypes.INTEGER,
      field: 'langue',
      allowNull: true,
      get() {
        const val = this.getDataValue('classe_id');
        return val ? parseInt(val, 10) : null;
      },
      set(val) {
        this.setDataValue('classe_id', val ? String(val) : null);
      }
    },
    photo: {
      type: DataTypes.STRING(255),
      field: 'photoURL',
    },
    statut: {
      type: DataTypes.TINYINT,
      field: 'actif',
      defaultValue: 1,
      get() {
        const val = this.getDataValue('statut');
        return val === 1 ? 'actif' : 'radie';
      },
      set(val) {
        this.setDataValue('statut', val === 'actif' || val === 1 ? 1 : 0);
      }
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    date_inscription: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('created_at');
      }
    }
  }, {
    sequelize,
    modelName: 'Eleve',
    tableName: 'Eleves',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  return Eleve;
};
