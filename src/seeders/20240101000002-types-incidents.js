module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('TypeIncidents', [
      { nom: 'Retard', description: 'Arrivée en retard en classe', created_at: new Date(), updated_at: new Date() },
      { nom: 'Insolence', description: 'Manque de respect envers un enseignant', created_at: new Date(), updated_at: new Date() },
      { nom: 'Bagarre', description: 'Conflit physique avec un autre élève', created_at: new Date(), updated_at: new Date() },
      { nom: 'Dégradation', description: 'Détérioration de matériel ou de locaux', created_at: new Date(), updated_at: new Date() },
      { nom: 'Absence injustifiée', description: 'Absence non justifiée', created_at: new Date(), updated_at: new Date() },
      { nom: 'Autre', description: 'Autre type d\'incident', created_at: new Date(), updated_at: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('TypeIncidents', null, {});
  }
};
