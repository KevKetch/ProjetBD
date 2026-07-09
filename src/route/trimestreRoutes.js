// src/routes/trimestreRoutes.js
const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const trimestreController = require('../controllers/trimestreController');

// ================================================================
// Validation Schemas
// ================================================================

const createAnneeSchema = Joi.object({
  libelle: Joi.string().required().max(100),
  periode: Joi.string().allow('', null).max(100)
});

const updateAnneeSchema = Joi.object({
  libelle: Joi.string().max(100),
  periode: Joi.string().allow('', null).max(100)
});

const createTrimestreSchema = Joi.object({
  libelle: Joi.string().required().max(100),
  periode: Joi.string().allow('', null).max(100),
  date_debut: Joi.date().allow(null),
  date_fin: Joi.date().allow(null),
  idAca: Joi.number().required(),
  ordre: Joi.number().min(1).max(3).allow(null)
});

const updateTrimestreSchema = Joi.object({
  libelle: Joi.string().max(100),
  periode: Joi.string().allow('', null).max(100),
  date_debut: Joi.date().allow(null),
  date_fin: Joi.date().allow(null),
  idAca: Joi.number().allow(null),
  ordre: Joi.number().min(1).max(3).allow(null)
});

const generateSequencesSchema = Joi.object({
  idTrimestre: Joi.number().required(),
  nbSequences: Joi.number().min(1).max(6).default(2)
});

// ================================================================
// Annee Academique Routes
// ================================================================

router.get('/annees', authenticate, trimestreController.listAnnees);
router.get('/annees/:id', authenticate, trimestreController.getAnnee);
router.post('/annees',
  authenticate,
  checkRole(['directeur', 'admin']),
  validate(createAnneeSchema),
  trimestreController.createAnnee
);
router.put('/annees/:id',
  authenticate,
  checkRole(['directeur', 'admin']),
  validate(updateAnneeSchema),
  trimestreController.updateAnnee
);
router.delete('/annees/:id',
  authenticate,
  checkRole(['directeur', 'admin']),
  trimestreController.deleteAnnee
);

// ================================================================
// Trimestre Routes
// ================================================================

router.get('/current', authenticate, trimestreController.getCurrentTrimestre);
router.get('/', authenticate, trimestreController.listTrimestres);
router.get('/:id', authenticate, trimestreController.getTrimestre);

router.post('/',
  authenticate,
  checkRole(['directeur', 'admin']),
  validate(createTrimestreSchema),
  trimestreController.createTrimestre
);

router.put('/:id',
  authenticate,
  checkRole(['directeur', 'admin']),
  validate(updateTrimestreSchema),
  trimestreController.updateTrimestre
);

router.delete('/:id',
  authenticate,
  checkRole(['directeur', 'admin']),
  trimestreController.deleteTrimestre
);

// ================================================================
// Sequences Generation
// ================================================================

router.post('/generate-sequences',
  authenticate,
  checkRole(['directeur', 'admin']),
  validate(generateSequencesSchema),
  trimestreController.generateSequences
);

module.exports = router;
