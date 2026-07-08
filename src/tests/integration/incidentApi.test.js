const request = require('supertest');
const app = require('../../app');
const { sequelize, User, Role, Incident, Eleve } = require('../../models');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const adminUser = await User.create({
    email: 'directeur@ecole.com',
    password: 'password',
    typeAdmin: 2,
  });
  const role = await Role.findOne({ where: { name: 'directeur' } });
  await adminUser.addRole(role);
  token = jwt.sign({ ID: adminUser.id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await sequelize.close();
});

describe('API Incidents (intégration)', () => {
  it('POST /api/v1/incidents – doit créer un incident', async () => {
    const eleve = await Eleve.create({ nom: 'IncidentTest', prenom: 'Test' });
    const incidentData = {
      eleve_matricule: eleve.matricule,
      type_incident_id: 1,
      enseignant_id: 1,
      description: 'Retard',
      gravite: 1,
      statut: 'signale',
    };
    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send(incidentData)
      .expect(201);
    expect(res.body.libelle).toBe('Retard');
  });

  it('GET /api/v1/incidents/eleve/:matricule – doit lister les incidents d’un élève', async () => {
    const eleve = await Eleve.create({ nom: 'GetIncidents', prenom: 'Test' });
    await Incident.create({
      description: 'Test incident',
      gravite: 2,
      eleve_matricule: eleve.matricule,
      type_incident_id: 1,
      enseignant_id: 1,
    });
    const res = await request(app)
      .get(`/api/v1/incidents/eleve/${eleve.matricule}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
