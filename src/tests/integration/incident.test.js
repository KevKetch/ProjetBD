const { Incident, sequelize } = require('../../models');

describe('Incident Model (unitaire)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer un incident avec les champs obligatoires', async () => {
    const incident = await Incident.create({
      description: 'Retard',
      gravite: 2,
      eleve_matricule: 'E1',
      type_incident_id: 1,
      enseignant_id: 1,
      statut: 'signale',
    });
    expect(incident.description).toBe('Retard');
    expect(incident.gravite).toBe(2);
  });

  it('devrait mettre à jour un incident', async () => {
    const incident = await Incident.create({
      description: 'Insolence',
      gravite: 3,
      eleve_matricule: 'E1',
      type_incident_id: 1,
      enseignant_id: 1,
    });
    await incident.update({ gravite: 4 });
    expect(incident.gravite).toBe(4);
  });
});
