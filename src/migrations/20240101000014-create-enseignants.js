'use strict';

// La table Enseignants n'existait pas du tout dans le projet d'origine :
// le modèle src/models/Enseignant.js référençait `user_id` (via
// User.hasOne(Enseignant, { foreignKey: 'user_id' })) mais aucune migration
// ne créait la table -> toute requête sur ce modèle échouait
// (ER_NO_SUCH_TABLE). Cette migration comble le manque en respectant les
// conventions déjà en place dans le projet (id auto-incrément, idAdmin en
// entier libre par défaut à 1, timestamps created_at/updated_at).

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enseignants', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      matricule: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      specialite: { type: Sequelize.STRING(100) },
      telephone: { type: Sequelize.STRING(20) },
      actif: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      idAdmin: { type: Sequelize.INTEGER, defaultValue: 1 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Enseignants');
  },
};
