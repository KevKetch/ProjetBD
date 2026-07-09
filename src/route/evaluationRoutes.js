// src/routes/examRoutes.js
const router = require('express').Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const Joi = require('joi');
const examController = require('../controllers/evaluationController');
const multer = require('multer');
const path = require('path');

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/examens/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  }
});

// Schémas de validation
const createEpreuveSchema = Joi.object({
  idTrimestre: Joi.number().required(),
  idNature: Joi.number().required(),
  idMatiere: Joi.number().required(),
  idClasse: Joi.number().required(),
  idPers: Joi.number().required(),
  titre: Joi.string().required().max(200),
  description: Joi.string().allow('', null),
  duree_minutes: Joi.number().min(1).allow(null),
  coefficient: Joi.number().min(0.5).max(5).default(1),
  total_points: Joi.number().min(1).default(20),
  date_epreuve: Joi.date().allow(null)
});

const updateEpreuveSchema = Joi.object({
  idTrimestre: Joi.number().optional(),
  idNature: Joi.number().optional(),
  idMatiere: Joi.number().optional(),
  idClasse: Joi.number().optional(),
  idPers: Joi.number().optional(),
  titre: Joi.string().max(200),
  description: Joi.string().allow('', null),
  duree_minutes: Joi.number().min(1).allow(null),
  coefficient: Joi.number().min(0.5).max(5),
  total_points: Joi.number().min(1),
  date_epreuve: Joi.date().allow(null),
  is_published: Joi.boolean()
});

const notesSchema = Joi.object({
  notes: Joi.array().items(
    Joi.object({
      matricule: Joi.number().required(),
      note: Joi.number().min(0).max(20).allow(null),
      appreciation: Joi.string().allow('', null)
    })
  ).required()
});

// ================================================================
// Routes
// ================================================================

// Natures et trimestres (publics pour les utilisateurs authentifiés)
router.get('/natures', authenticate, examController.listNatures);
router.get('/trimestres', authenticate, examController.listTrimestres);

// Liste des épreuves
router.get('/', authenticate, checkRole(['directeur', 'enseignant', 'admin']), examController.listEpreuves);

// Statistiques
router.get('/stats', authenticate, checkRole(['directeur', 'admin']), examController.getExamStats);

// Épreuves par élève
router.get('/eleve/:matricule', authenticate, checkRole(['directeur', 'enseignant', 'parent']), examController.getEpreuvesByEleve);

// Détail d'une épreuve
router.get('/:id', authenticate, checkRole(['directeur', 'enseignant', 'admin']), examController.getEpreuve);

// Notes d'une épreuve
router.get('/:id/notes', authenticate, checkRole(['directeur', 'enseignant', 'admin']), examController.getNotesEpreuve);

// Créer une épreuve
router.post('/', authenticate, checkRole(['directeur', 'enseignant']), validate(createEpreuveSchema), examController.createEpreuve);

// Modifier une épreuve
router.put('/:id', authenticate, checkRole(['directeur', 'enseignant']), validate(updateEpreuveSchema), examController.updateEpreuve);

// Supprimer une épreuve
router.delete('/:id', authenticate, checkRole(['directeur', 'admin']), examController.deleteEpreuve);

// Publier/Dépublier
router.post('/:id/publish', authenticate, checkRole(['directeur', 'admin']), examController.publishEpreuve);
router.post('/:id/unpublish', authenticate, checkRole(['directeur', 'admin']), examController.unpublishEpreuve);

// Saisie des notes
router.post('/:id/notes', authenticate, checkRole(['directeur', 'enseignant']), validate(notesSchema), examController.saisirNotes);

// Upload de fichiers
router.post('/:id/upload-sujet', authenticate, checkRole(['directeur', 'enseignant']), upload.single('fichier'), examController.uploadSujet);
router.post('/:id/upload-correction', authenticate, checkRole(['directeur', 'enseignant']), upload.single('fichier'), examController.uploadCorrection);

module.exports = router;
