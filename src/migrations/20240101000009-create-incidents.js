module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Incidents', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      libelle: { type: Sequelize.STRING(100), allowNull: false },
      points: { type: Sequelize.INTEGER, defaultValue: 0 },
      matricule: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Eleves', key: 'matricule' } },
      idAnnee: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'AnneeAcademique', key: 'idAnnee' } },
      commentaire: { type: Sequelize.TEXT },
      event_date: { type: Sequelize.DATEONLY },
      idPers: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Personne', key: 'idPers' } },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Incidents');
  }
};
