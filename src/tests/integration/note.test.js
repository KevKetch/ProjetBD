const { Note, sequelize } = require('../../models');

describe('Note Model (unitaire)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une note avec les champs obligatoires', async () => {
    const note = await Note.create({
      valeur: 15.5,
      eleve_matricule: 'E1',
      matiere_id: 1,
      sequence_id: 1,
      enseignant_id: 1,
    });
    expect(note.valeur).toBe('15.50');
    expect(note.id).toBeDefined();
  });

  it('devrait refuser une note hors de l’intervalle [0,20] (validation côté base ou code)', async () => {
    await expect(Note.create({
      valeur: 25,
      eleve_matricule: 'E1',
      matiere_id: 1,
      sequence_id: 1,
      enseignant_id: 1,
    })).rejects.toThrow();
  });
});
