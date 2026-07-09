// src/routes/paiementRoutes.js
const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const paiementController = require('../controllers/paiementController');

// ================================================================
// Validation Schemas
// ================================================================

const createFraisSchema = Joi.object({
  code: Joi.string().required().max(30),
                                     libelle: Joi.string().required().max(80),
                                     description: Joi.string().allow('', null)
});

const createEcheancierSchema = Joi.object({
  libelle: Joi.string().required().max(60),
                                          montant: Joi.number().positive().required(),
                                          date_echeance: Joi.date().allow(null),
                                          ordre: Joi.number().min(1).allow(null),
                                          idFrais: Joi.number().required(),
                                          idAnnee: Joi.number().required(),
                                          niveau: Joi.string().valid('PS', 'MS', 'GS', 'SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2').allow(null),
                                          description: Joi.string().allow('', null),
                                          is_active: Joi.boolean()
});

const createPaiementSchema = Joi.object({
  matricule: Joi.number().required(),
                                        idAnnee: Joi.number().optional(),
                                        idEcheancier: Joi.number().allow(null),
                                        montant: Joi.number().positive().required(),
                                        mode_paiement: Joi.string().valid('especes', 'mobile_money', 'virement', 'cheque'),
                                        statut: Joi.string().valid('paye', 'partiel', 'annule'),
                                        date_paiement: Joi.date().allow(null),
                                        operation_ID: Joi.string().allow('', null),
                                        commentaire: Joi.string().allow('', null)
});

const updatePaiementSchema = Joi.object({
  mode_paiement: Joi.string().valid('especes', 'mobile_money', 'virement', 'cheque'),
                                        statut: Joi.string().valid('paye', 'partiel', 'annule'),
                                        date_paiement: Joi.date(),
                                        commentaire: Joi.string().allow('', null)
});

const reorderSchema = Joi.object({
  idAnnee: Joi.number().required(),
                                 idFrais: Joi.number().required(),
                                 ordre_ids: Joi.array().items(Joi.number()).min(1).required()
});

// ================================================================
// Routes
// ================================================================

router.use(authenticate);

// ================================================================
// FRAIS (Types de paiement)
// ================================================================

router.get('/frais', paiementController.listFrais);
router.get('/frais/:id', paiementController.getFrais);
router.post('/frais', checkRole(['admin', 'directeur']), validate(createFraisSchema), paiementController.createFrais);
router.put('/frais/:id', checkRole(['admin', 'directeur']), paiementController.updateFrais);
router.delete('/frais/:id', checkRole(['admin']), paiementController.deleteFrais);

// ================================================================
// ECHEANCIER (Tranches)
// ================================================================

router.get('/echeanciers', paiementController.listEcheanciers);
router.get('/echeanciers/:id', paiementController.getEcheancier);
router.post('/echeanciers', checkRole(['admin', 'directeur']), validate(createEcheancierSchema), paiementController.createEcheancier);
router.put('/echeanciers/:id', checkRole(['admin', 'directeur']), paiementController.updateEcheancier);
router.delete('/echeanciers/:id', checkRole(['admin']), paiementController.deleteEcheancier);
router.post('/echeanciers/reorder', checkRole(['admin', 'directeur']), validate(reorderSchema), paiementController.reorderEcheanciers);

// ================================================================
// PAIEMENTS
// ================================================================

router.get('/', paiementController.listPaiements);
router.get('/stats', checkRole(['admin', 'directeur']), paiementController.getStats);
router.get('/stats/eleve/:matricule', checkRole(['admin', 'directeur', 'parent']), paiementController.getStatsByEleve);
router.get('/rapport/impayes', checkRole(['admin', 'directeur']), paiementController.getRapportImpayes);
router.get('/:id', paiementController.getPaiement);
router.get('/recu/:numero', paiementController.getPaiementByReçu);
router.get('/eleve/:matricule', checkRole(['admin', 'directeur', 'parent']), paiementController.getPaiementsByEleve);

router.post('/', checkRole(['admin', 'directeur']), validate(createPaiementSchema), paiementController.createPaiement);
router.put('/:id', checkRole(['admin', 'directeur']), validate(updatePaiementSchema), paiementController.updatePaiement);
router.post('/:id/annuler', checkRole(['admin', 'directeur']), paiementController.cancelPaiement);
router.delete('/:id', checkRole(['admin']), paiementController.deletePaiement);

module.exports = router;
