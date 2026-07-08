const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const presenceController = require('../controllers/presenceController');

const createPresenceSchema = Joi.object({
  eleve_matricule: Joi.string().required(),
  date: Joi.date().required(),
  statut: Joi.string().valid('present', 'absent', 'justifie').required(),
  motif_absence: Joi.string().allow(''),
  piece_jointe: Joi.string().allow(''),
  justifiee: Joi.boolean(),
});

router.use(authenticate, blockFondateur);

router.post('/eleve', checkRole(['directeur', 'enseignant']), validate(createPresenceSchema), presenceController.createPresence);
router.get('/eleve/:matricule', checkRole(['directeur', 'enseignant', 'parent']), presenceController.getPresencesEleve);
router.get('/classe/:classe_id', checkRole(['directeur', 'enseignant']), presenceController.getPresencesClasse);
router.post('/:id/justifier', checkRole(['directeur', 'enseignant']), presenceController.justifierPresence);
router.get('/statistiques', checkRole(['directeur']), presenceController.getStatistiquesPresences);
router.get('/liste-appel/:classe_id', checkRole(['directeur', 'enseignant']), presenceController.listeAppel);

module.exports = router;
