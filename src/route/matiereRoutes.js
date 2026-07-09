// src/routes/matiereRoutes.js
const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const matiereController = require('../controllers/matiereController');

// Schémas de validation
const createMatiereSchema = Joi.object({
    nom: Joi.string().required().max(100),
                                       code: Joi.string().allow('', null).max(20),
                                       description: Joi.string().allow('', null),
                                       coefficient: Joi.number().min(0.5).max(5).default(1),
                                       is_active: Joi.boolean().default(true)
});

const updateMatiereSchema = Joi.object({
    nom: Joi.string().max(100),
                                       code: Joi.string().allow('', null).max(20),
                                       description: Joi.string().allow('', null),
                                       coefficient: Joi.number().min(0.5).max(5),
                                       is_active: Joi.boolean()
});

const assignSchema = Joi.object({
    classe_id: Joi.number().required(),
                                coefficient: Joi.number().min(0.5).max(5).default(1),
                                enseignant_id: Joi.number().allow(null)
});

router.use(authenticate);

// Routes principales
router.get('/',
           checkRole(['directeur', 'enseignant', 'admin']),
           matiereController.listMatieres
);

router.get('/stats',
           checkRole(['directeur', 'admin']),
           matiereController.getMatiereStats
);

router.get('/:id',
           checkRole(['directeur', 'enseignant', 'admin']),
           matiereController.getMatiere
);

router.get('/:id/classes',
           checkRole(['directeur', 'enseignant', 'admin']),
           matiereController.getMatiereClasses
);

router.post('/',
            checkRole(['directeur', 'admin']),
            validate(createMatiereSchema),
            matiereController.createMatiere
);

router.put('/:id',
           checkRole(['directeur', 'admin']),
           validate(updateMatiereSchema),
           matiereController.updateMatiere
);

router.delete('/:id',
              checkRole(['directeur', 'admin']),
              matiereController.deleteMatiere
);

router.post('/:id/restore',
            checkRole(['directeur', 'admin']),
            matiereController.restoreMatiere
);

// Assignation aux classes
router.post('/:id/assign-classe',
            checkRole(['directeur', 'admin']),
            validate(assignSchema),
            matiereController.assignToClasse
);

router.post('/:id/unassign-classe/:classeId',
            checkRole(['directeur', 'admin']),
            matiereController.unassignFromClasse
);

module.exports = router;
