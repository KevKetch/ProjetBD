const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await bcrypt.hash('1234', 10);

    // Vérifier si les utilisateurs existent déjà pour éviter les doublons
    const existingDirecteur = await queryInterface.rawSelect('Users', { where: { email: 'directeur@ecole.cm' } }, ['id']);
    if (!existingDirecteur) {
      await queryInterface.bulkInsert('Users', [
        {
          email: 'directeur@ecole.cm',
          password: passwordHash,
          nom: 'Tchamba',
          prenom: 'Rose',
          actif: 1,
          typeAdmin: 2, // directeur
          mobile: '677001122',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'fondateur@ecole.cm',
          password: passwordHash,
          nom: 'Kamga',
          prenom: 'Emmanuel',
          actif: 1,
          typeAdmin: 1, // fondateur
          mobile: '699887766',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'enseignant@ecole.cm',
          password: passwordHash,
          nom: 'Nkomo',
          prenom: 'Albert',
          actif: 1,
          typeAdmin: 4, // enseignant
          mobile: '655443322',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'parent@ecole.cm',
          password: passwordHash,
          nom: 'Ebongue',
          prenom: 'Marie',
          actif: 1,
          typeAdmin: 5, // parent
          mobile: '676543210',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
