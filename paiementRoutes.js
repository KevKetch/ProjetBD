const router = require('express').Router();
const { authenticate, blockFondateur, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const paiementController = require('../controllers/paiementController');

const createPaiementSchema = Joi.object({
  matricule: Joi.number().required(),
  idAnnee: Joi.number().optional(),
  montant: Joi.number().positive().required(),
  mode_paiement: Joi.string().valid('especes', 'mobile_money', 'virement', 'cheque').optional(),
  statut: Joi.string().valid('paye', 'partiel', 'annule').optional(),
  date_paiement: Joi.alternatives().try(Joi.date(), Joi.string()).optional(),
  operation_ID: Joi.string().allow('', null).optional(),
  commentaire: Joi.string().allow('', null).optional(),
}).unknown(true);

const updatePaiementSchema = Joi.object({
  mode_paiement: Joi.string().valid('especes', 'mobile_money', 'virement', 'cheque').optional(),
  statut: Joi.string().valid('paye', 'partiel', 'annule').optional(),
  date_paiement: Joi.alternatives().try(Joi.date(), Joi.string()).optional(),
  commentaire: Joi.string().allow('', null).optional(),
}).unknown(true);

router.use(authenticate, blockFondateur);

router.get('/', checkRole(['directeur', 'admin']), paiementController.listPaiements);
router.get('/stats', checkRole(['directeur', 'admin']), paiementController.getStats);
router.get('/eleve/:matricule', checkRole(['directeur', 'admin', 'enseignant']), paiementController.getPaiementsByEleve);
router.get('/:id', checkRole(['directeur', 'admin']), paiementController.getPaiement);
router.post('/', checkRole(['directeur', 'admin']), validate(createPaiementSchema), paiementController.createPaiement);
router.put('/:id', checkRole(['directeur', 'admin']), validate(updatePaiementSchema), paiementController.updatePaiement);
router.post('/:id/annuler', checkRole(['directeur', 'admin']), paiementController.cancelPaiement);
router.delete('/:id', checkRole(['directeur', 'admin']), paiementController.deletePaiement);

module.exports = router;
