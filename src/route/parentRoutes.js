// src/routes/parentRoutes.js
const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const parentController = require('../controllers/parentController');

// ================================================================
// Validation Schemas
// ================================================================

const messageSchema = Joi.object({
  destinataire_id: Joi.number().required(),
  sujet: Joi.string().max(200),
  message: Joi.string().required(),
  type: Joi.string().valid('general', 'urgence', 'reclamation')
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(6).required()
});

const createParentSchema = Joi.object({
  matricule: Joi.number().required(),
  parent_nom: Joi.string().required(),
  parent_prenom: Joi.string().required(),
  parent_telephone: Joi.string().required(),
  parent_email: Joi.string().email().allow('', null),
  relation: Joi.string().valid('pere', 'mere', 'tuteur'),
  is_primary: Joi.boolean()
});

// ================================================================
// Routes (All require authentication)
// ================================================================

// Profil parent
router.get('/me', authenticate, parentController.getMyProfile);

// Enfants
router.get('/enfants', authenticate, parentController.getMyChildren);
router.get('/enfants/:matricule/notes', authenticate, parentController.getChildNotes);
router.get('/enfants/:matricule/bulletin', authenticate, parentController.getChildBulletin);
router.get('/enfants/:matricule/discipline', authenticate, parentController.getChildDiscipline);
router.get('/enfants/:matricule/rapport', authenticate, parentController.getChildFullReport);

// Messages
router.get('/messages', authenticate, parentController.getMessages);
router.get('/destinataires', authenticate, parentController.getDestinataires);
router.post('/messages', authenticate, validate(messageSchema), parentController.sendMessage);

// Compte
router.put('/change-password', authenticate, validate(changePasswordSchema), parentController.changePassword);

// ================================================================
// Admin Routes (for creating parent accounts)
// ================================================================

router.post('/create-from-eleve', 
  authenticate, 
  checkRole(['admin', 'directeur']),
  validate(createParentSchema),
  parentController.createParentFromEleve
);

module.exports = router;