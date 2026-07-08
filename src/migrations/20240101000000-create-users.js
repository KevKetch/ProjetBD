module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      nom: { type: Sequelize.STRING(100) },
      prenom: { type: Sequelize.STRING(100) },
      actif: { type: Sequelize.TINYINT, defaultValue: 1 },
      typeAdmin: { type: Sequelize.SMALLINT, defaultValue: 2 }, // 1=fondateur, 2=directeur, 3=admin, 4=enseignant, 5=parent
      mobile: Sequelize.STRING(15),
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
