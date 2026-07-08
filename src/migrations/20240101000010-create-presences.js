module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Presences', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      matricule: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Eleves', key: 'matricule' } },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      statut: { type: Sequelize.ENUM('present', 'absent', 'justifie'), allowNull: false },
      motif_absence: { type: Sequelize.STRING(255) },
      piece_jointe: { type: Sequelize.STRING(255) },
      justifiee: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Presences');
  }
};
