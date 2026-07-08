const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const eleveController = require('../controllers/eleveController');

// Schémas de validation
const createEleveSchema = Joi.object({
  matricule: Joi.string().required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  date_naissance: Joi.date().required(),
  lieu_naissance: Joi.string().allow(''),
  sexe: Joi.string().valid('M', 'F').required(),
  photo: Joi.string().allow(''),
  classe_id: Joi.number().allow(null),
  parent_id: Joi.number().allow(null),
});

const updateEleveSchema = createEleveSchema.fork(['matricule'], (schema) => schema.optional());

router.use(authenticate, blockFondateur);

router.get('/', checkRole(['directeur', 'enseignant']), eleveController.listEleves);
router.get('/:matricule', checkRole(['directeur', 'enseignant']), eleveController.getEleve);
router.post('/', checkRole(['directeur']), validate(createEleveSchema), eleveController.createEleve);
router.put('/:matricule', checkRole(['directeur']), validate(updateEleveSchema), eleveController.updateEleve);
router.delete('/:matricule', checkRole(['directeur']), eleveController.deleteEleve);

router.post('/:matricule/inscrire', checkRole(['directeur']), eleveController.inscrire);
router.post('/:matricule/radier', checkRole(['directeur']), eleveController.radier);
router.post('/:matricule/classe', checkRole(['directeur']), eleveController.changerClasse);
router.get('/:matricule/historique', checkRole(['directeur']), eleveController.historique);
router.get('/:matricule/pdf', checkRole(['directeur', 'enseignant']), eleveController.generatePdf);

module.exports = router;
