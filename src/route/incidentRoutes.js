const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const incidentController = require('../controllers/incidentController');

const createIncidentSchema = Joi.object({
  eleve_matricule: Joi.string().required(),
  type_incident_id: Joi.number().required(),
  enseignant_id: Joi.number().required(),
  date: Joi.date().allow(null),
  description: Joi.string().required(),
  gravite: Joi.number().min(1).max(5).required(),
  statut: Joi.string().valid('signale', 'traite', 'clos'),
});

router.use(authenticate, blockFondateur);

router.post('/', checkRole(['directeur', 'enseignant']), validate(createIncidentSchema), incidentController.createIncident);
router.get('/eleve/:matricule', checkRole(['directeur', 'enseignant', 'parent']), incidentController.getIncidentsEleve);
router.get('/classe/:classe_id', checkRole(['directeur', 'enseignant']), incidentController.getIncidentsClasse);
router.post('/:id/sanction', checkRole(['directeur', 'enseignant']), incidentController.ajouterSanction);
router.get('/types', checkRole(['directeur', 'enseignant']), incidentController.listTypesIncidents);
router.put('/:id', checkRole(['directeur', 'enseignant']), incidentController.updateIncident);
router.get('/statistiques', checkRole(['directeur']), incidentController.getStatistiquesIncidents);
router.get('/:id/pdf', checkRole(['directeur', 'enseignant']), incidentController.generatePdfIncident);

module.exports = router;
