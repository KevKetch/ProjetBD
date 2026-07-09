const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Incident extends Model {
    static associate(models) {
      this.belongsTo(models.Eleve, { foreignKey: 'eleve_matricule', targetKey: 'matricule' });
      this.belongsTo(models.TypeIncident, { foreignKey: 'type_incident_id' });
      this.belongsTo(models.Enseignant, { foreignKey: 'enseignant_id' });
      this.hasOne(models.Sanction, { foreignKey: 'incident_id' });
    }
  }

  Incident.init({
    date: {
      type: DataTypes.DATE,
      field: 'event_date'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'commentaire'
    },
    gravite: {
      type: DataTypes.INTEGER,
      field: 'points',
      validate: { min: 1, max: 5 },
    },
    eleve_matricule: {
      type: DataTypes.INTEGER,
      field: 'matricule',
      allowNull: false,
      get() {
        const id = this.getDataValue('eleve_matricule');
        if (!id) return null;
        const year = this.getDataValue('created_at')
          ? new Date(this.getDataValue('created_at')).getFullYear()
          : new Date().getFullYear();
        return `MAT-${year}-${String(id).padStart(3, '0')}`;
      },
      set(val) {
        if (typeof val === 'string' && val.includes('-')) {
          const parts = val.split('-');
          const id = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(id)) {
            this.setDataValue('eleve_matricule', id);
          }
        } else {
          this.setDataValue('eleve_matricule', val);
        }
      }
    },
    type_incident_id: {
      type: DataTypes.INTEGER,
      field: 'libelle',
      allowNull: false
    },
    enseignant_id: {
      type: DataTypes.INTEGER,
      field: 'idPers',
      allowNull: false
    },
    idAnnee: {
      type: DataTypes.INTEGER,
      field: 'idAnnee',
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Incident',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Incident;
};
