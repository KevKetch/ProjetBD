const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const eleveController = require('../controllers/eleveController');

// Schémas de validation
const createEleveSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  date_naissance: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
  lieu_naissance: Joi.string().allow('', null).optional(),
  sexe: Joi.string().valid('M', 'F').required(),
  photo: Joi.string().allow('', null).optional(),
  classe_id: Joi.number().allow(null).optional(),
  parent_id: Joi.number().allow(null).optional(),
  idAdmin: Joi.number().optional(),
}).unknown(true);  // allow extra fields from frontend

const updateEleveSchema = createEleveSchema;

router.use(authenticate, blockFondateur);

router.get('/', checkRole(['directeur', 'enseignant', 'admin']), eleveController.listEleves);
router.get('/:matricule', checkRole(['directeur', 'enseignant', 'admin']), eleveController.getEleve);
router.post('/', checkRole(['directeur', 'admin']), validate(createEleveSchema), eleveController.createEleve);
router.put('/:matricule', checkRole(['directeur', 'admin']), validate(updateEleveSchema), eleveController.updateEleve);
router.delete('/:matricule', checkRole(['directeur', 'admin']), eleveController.deleteEleve);

router.post('/:matricule/inscrire', checkRole(['directeur', 'admin']), eleveController.inscrire);
router.post('/:matricule/radier', checkRole(['directeur', 'admin']), eleveController.radier);
router.post('/:matricule/classe', checkRole(['directeur', 'admin']), eleveController.changerClasse);
router.get('/:matricule/historique', checkRole(['directeur', 'admin']), eleveController.historique);
router.get('/:matricule/pdf', checkRole(['directeur', 'enseignant', 'admin']), eleveController.generatePdf);

module.exports = router;
