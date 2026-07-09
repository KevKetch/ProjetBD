const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Enseignant extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      // Associations déjà présentes dans le modèle d'origine, conservées
      // telles quelles (hors périmètre de cette correction) :
      this.hasMany(models.Note, { foreignKey: 'enseignant_id' });
      this.hasMany(models.Incident, { foreignKey: 'enseignant_id' });
    }
  }

  Enseignant.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    matricule: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    specialite: DataTypes.STRING(100),
    telephone: DataTypes.STRING(20),
    actif: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'Enseignant',
    tableName: 'Enseignants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Enseignant;
};
