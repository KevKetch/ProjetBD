module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Roles', [
      { name: 'fondateur', created_at: new Date(), updated_at: new Date() },
      { name: 'directeur', created_at: new Date(), updated_at: new Date() },
      { name: 'admin', created_at: new Date(), updated_at: new Date() },
      { name: 'enseignant', created_at: new Date(), updated_at: new Date() },
      { name: 'parent', created_at: new Date(), updated_at: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
