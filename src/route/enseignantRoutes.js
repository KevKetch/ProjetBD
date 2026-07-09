const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const enseignantController = require('../controllers/enseignantController');

const createEnseignantSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().allow('', null).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  matricule: Joi.string().required(),
  specialite: Joi.string().allow('', null).optional(),
  telephone: Joi.string().allow('', null).optional(),
}).unknown(true);

const updateEnseignantSchema = Joi.object({
  nom: Joi.string().optional(),
  prenom: Joi.string().allow('', null).optional(),
  email: Joi.string().email().optional(),
  matricule: Joi.string().optional(),
  specialite: Joi.string().allow('', null).optional(),
  telephone: Joi.string().allow('', null).optional(),
  actif: Joi.boolean().optional(),
}).unknown(true);

router.use(authenticate, blockFondateur);

router.get('/', checkRole(['directeur', 'admin', 'enseignant']), enseignantController.listEnseignants);
router.get('/:id', checkRole(['directeur', 'admin', 'enseignant']), enseignantController.getEnseignant);
router.post('/', checkRole(['directeur', 'admin']), validate(createEnseignantSchema), enseignantController.createEnseignant);
router.put('/:id', checkRole(['directeur', 'admin']), validate(updateEnseignantSchema), enseignantController.updateEnseignant);
router.delete('/:id', checkRole(['directeur', 'admin']), enseignantController.deleteEnseignant);
router.post('/:id/restore', checkRole(['directeur', 'admin']), enseignantController.restoreEnseignant);

module.exports = router;
