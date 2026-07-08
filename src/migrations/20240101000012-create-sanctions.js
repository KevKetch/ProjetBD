module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sanctions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      incident_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Incidents', key: 'id' } },
      type_sanction: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT },
      date: { type: Sequelize.DATEONLY },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Sanctions');
  }
};
