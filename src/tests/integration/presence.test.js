const { Presence, sequelize } = require('../../models');

describe('Presence Model (unitaire)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une présence avec les champs obligatoires', async () => {
    const presence = await Presence.create({
      matricule: 1,
      date: '2025-01-01',
      statut: 'present',
    });
    expect(presence.statut).toBe('present');
    expect(presence.justifiee).toBe(false);
  });

  it('devrait marquer une absence comme justifiée', async () => {
    const presence = await Presence.create({
      matricule: 1,
      date: '2025-01-02',
      statut: 'absent',
      motif_absence: 'Maladie',
    });
    presence.justifiee = true;
    await presence.save();
    expect(presence.justifiee).toBe(true);
  });
});
