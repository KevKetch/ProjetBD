// src/controllers/examController.js
const { Epreuve, NatureEpreuve, Trimestre, Matiere, Classe, Personne, EpreuveNote, Eleve, sequelize } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/v1/examens/natures
 * Liste des natures d'épreuves
 */
exports.listNatures = async (req, res) => {
  try {
    const natures = await NatureEpreuve.findAll({
      where: { is_active: 1 },
      order: [['libelle', 'ASC']]
    });
    res.json({ success: true, data: natures });
  } catch (err) {
    console.error('[examController.listNatures]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/examens/trimestres
 * Liste des trimestres avec leurs séquences
 */
exports.listTrimestres = async (req, res) => {
  try {
    const { idAnnee } = req.query;
    const where = {};
    if (idAnnee) where.idAca = idAnnee;

    const trimestres = await Trimestre.findAll({
      where,
      include: [{
        model: Sequence,
        as: 'sequences',
        order: [['idSequence', 'ASC']]
      }],
      order: [['idTrimes', 'ASC']]
    });
    res.json({ success: true, data: trimestres });
  } catch (err) {
    console.error('[examController.listTrimestres]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/examens
 * Liste des épreuves avec recherche avancée
 * Query: search, idMatiere, idClasse, idNature, idTrimestre, date_debut, date_fin, is_published
 */
exports.listEpreuves = async (req, res) => {
  try {
    const {
      search,
      idMatiere,
      idClasse,
      idNature,
      idTrimestre,
      date_debut,
      date_fin,
      is_published,
      limit = 50,
      page = 1
    } = req.query;

    const where = {};
    const include = [
      { model: Matiere, as: 'matiere' },
      { model: Classe, as: 'classe' },
      { model: NatureEpreuve, as: 'nature' },
      { model: Trimestre, as: 'trimestre' },
      { model: Personne, as: 'enseignant' }
    ];

    if (search) {
      where[Op.or] = [
        { titre: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { '$matiere.libelle$': { [Op.like]: `%${search}%` } }
      ];
    }

    if (idMatiere) where.idMatiere = idMatiere;
    if (idClasse) where.idClasse = idClasse;
    if (idNature) where.idNature = idNature;
    if (idTrimestre) where.idTrimestre = idTrimestre;

    if (date_debut || date_fin) {
      where.date_epreuve = {};
      if (date_debut) where.date_epreuve[Op.gte] = date_debut;
      if (date_fin) where.date_epreuve[Op.lte] = date_fin;
    }

    if (is_published !== undefined) {
      where.is_published = is_published === 'true' ? 1 : 0;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Epreuve.findAndCountAll({
      where,
      include,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('[examController.listEpreuves]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/examens/:id
 * Détail d'une épreuve avec ses notes
 */
exports.getEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id, {
      include: [
        { model: Matiere, as: 'matiere' },
        { model: Classe, as: 'classe' },
        { model: NatureEpreuve, as: 'nature' },
        { model: Trimestre, as: 'trimestre' },
        { model: Personne, as: 'enseignant' },
        {
          model: EpreuveNote,
          as: 'notes',
          include: [{ model: Eleve, as: 'eleve' }]
        }
      ]
    });

    if (!epreuve) {
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    res.json({ success: true, data: epreuve });
  } catch (err) {
    console.error('[examController.getEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/examens
 * Créer une épreuve
 */
exports.createEpreuve = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      idTrimestre,
      idNature,
      idMatiere,
      idClasse,
      idPers,
      titre,
      description,
      duree_minutes,
      coefficient,
      total_points,
      date_epreuve
    } = req.body;

    // Vérifications
    const trimestre = await Trimestre.findByPk(idTrimestre);
    if (!trimestre) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Trimestre non trouvé' });
    }

    const nature = await NatureEpreuve.findByPk(idNature);
    if (!nature || !nature.is_active) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Nature d\'épreuve non trouvée ou inactive' });
    }

    const matiere = await Matiere.findByPk(idMatiere);
    if (!matiere) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }

    const classe = await Classe.findByPk(idClasse);
    if (!classe) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Classe non trouvée' });
    }

    const enseignant = await Personne.findByPk(idPers);
    if (!enseignant) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Enseignant non trouvé' });
    }

    const epreuve = await Epreuve.create({
      idTrimestre,
      idNature,
      idMatiere,
      idClasse,
      idPers,
      titre,
      description: description || null,
      duree_minutes: duree_minutes || null,
      coefficient: coefficient || nature.coefficient || 1,
      total_points: total_points || 20,
      date_epreuve: date_epreuve || null,
      is_published: 0
    }, { transaction: t });

    await t.commit();

    const created = await Epreuve.findByPk(epreuve.idEpreuve, {
      include: [
        { model: Matiere, as: 'matiere' },
        { model: Classe, as: 'classe' },
        { model: NatureEpreuve, as: 'nature' },
        { model: Trimestre, as: 'trimestre' },
        { model: Personne, as: 'enseignant' }
      ]
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    await t.rollback();
    console.error('[examController.createEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/examens/:id
 * Modifier une épreuve
 */
exports.updateEpreuve = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    const {
      idTrimestre,
      idNature,
      idMatiere,
      idClasse,
      idPers,
      titre,
      description,
      duree_minutes,
      coefficient,
      total_points,
      date_epreuve,
      is_published
    } = req.body;

    // Vérifier les relations si modifiées
    if (idTrimestre && idTrimestre !== epreuve.idTrimestre) {
      const trimestre = await Trimestre.findByPk(idTrimestre);
      if (!trimestre) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Trimestre non trouvé' });
      }
    }

    if (idNature && idNature !== epreuve.idNature) {
      const nature = await NatureEpreuve.findByPk(idNature);
      if (!nature || !nature.is_active) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Nature d\'épreuve non trouvée ou inactive' });
      }
    }

    await epreuve.update({
      idTrimestre: idTrimestre || epreuve.idTrimestre,
      idNature: idNature || epreuve.idNature,
      idMatiere: idMatiere || epreuve.idMatiere,
      idClasse: idClasse || epreuve.idClasse,
      idPers: idPers || epreuve.idPers,
      titre: titre || epreuve.titre,
      description: description !== undefined ? description : epreuve.description,
      duree_minutes: duree_minutes !== undefined ? duree_minutes : epreuve.duree_minutes,
      coefficient: coefficient || epreuve.coefficient,
      total_points: total_points || epreuve.total_points,
      date_epreuve: date_epreuve !== undefined ? date_epreuve : epreuve.date_epreuve,
      is_published: is_published !== undefined ? is_published : epreuve.is_published
    }, { transaction: t });

    await t.commit();

    const updated = await Epreuve.findByPk(epreuve.idEpreuve, {
      include: [
        { model: Matiere, as: 'matiere' },
        { model: Classe, as: 'classe' },
        { model: NatureEpreuve, as: 'nature' },
        { model: Trimestre, as: 'trimestre' },
        { model: Personne, as: 'enseignant' }
      ]
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    await t.rollback();
    console.error('[examController.updateEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/examens/:id
 * Supprimer une épreuve
 */
exports.deleteEpreuve = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    // Vérifier si des notes existent
    const notesCount = await EpreuveNote.count({
      where: { idEpreuve: req.params.id }
    });

    if (notesCount > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${notesCount} note(s) associée(s) à cette épreuve`
      });
    }

    // Supprimer les fichiers
    if (epreuve.fichier_sujet) {
      const filePath = path.join(__dirname, '../uploads/examens', epreuve.fichier_sujet);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (epreuve.fichier_correction) {
      const filePath = path.join(__dirname, '../uploads/examens', epreuve.fichier_correction);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await epreuve.destroy({ transaction: t });
    await t.commit();

    res.json({ success: true, message: 'Épreuve supprimée avec succès' });
  } catch (err) {
    await t.rollback();
    console.error('[examController.deleteEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/examens/:id/publish
 * Publier une épreuve
 */
exports.publishEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    await epreuve.update({
      is_published: 1,
      date_publication: new Date()
    });

    res.json({
      success: true,
      message: 'Épreuve publiée avec succès',
      data: epreuve
    });
  } catch (err) {
    console.error('[examController.publishEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/examens/:id/unpublish
 * Dépublier une épreuve
 */
exports.unpublishEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    await epreuve.update({
      is_published: 0,
      date_publication: null
    });

    res.json({
      success: true,
      message: 'Épreuve dépubliée avec succès',
      data: epreuve
    });
  } catch (err) {
    console.error('[examController.unpublishEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/examens/:id/notes
 * Saisir les notes d'une épreuve
 * Body: { notes: [{ matricule, note, appreciation }] }
 */
exports.saisirNotes = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    const { notes } = req.body;
    if (!notes || !Array.isArray(notes)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'La liste des notes est requise' });
    }

    // Supprimer les notes existantes
    await EpreuveNote.destroy({
      where: { idEpreuve: req.params.id },
      transaction: t
    });

    // Créer les nouvelles notes
    const createdNotes = [];
    for (const noteData of notes) {
      const { matricule, note, appreciation } = noteData;

      // Vérifier que l'élève existe
      const eleve = await Eleve.findByPk(matricule);
      if (!eleve) {
        console.warn(`Élève ${matricule} non trouvé, ignoré`);
        continue;
      }

      const epreuveNote = await EpreuveNote.create({
        idEpreuve: req.params.id,
        matricule,
        note: note || null,
        appreciation: appreciation || null
      }, { transaction: t });

      createdNotes.push(epreuveNote);
    }

    await t.commit();

    res.json({
      success: true,
      message: `${createdNotes.length} note(s) enregistrée(s) avec succès`,
      data: createdNotes
    });
  } catch (err) {
    await t.rollback();
    console.error('[examController.saisirNotes]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/examens/:id/notes
 * Récupérer les notes d'une épreuve
 */
exports.getNotesEpreuve = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    const notes = await EpreuveNote.findAll({
      where: { idEpreuve: req.params.id },
      include: [{ model: Eleve, as: 'eleve' }],
      order: [['matricule', 'ASC']]
    });

    res.json({ success: true, data: notes });
  } catch (err) {
    console.error('[examController.getNotesEpreuve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/examens/eleve/:matricule
 * Récupérer les épreuves d'un élève
 */
exports.getEpreuvesByEleve = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { idTrimestre } = req.query;

    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    }

    const where = { idClasse: eleve.classe_id };
    if (idTrimestre) where.idTrimestre = idTrimestre;

    const epreuves = await Epreuve.findAll({
      where,
      include: [
        { model: Matiere, as: 'matiere' },
        { model: NatureEpreuve, as: 'nature' },
        { model: Trimestre, as: 'trimestre' },
        {
          model: EpreuveNote,
          as: 'notes',
          where: { matricule },
          required: false
        }
      ],
      order: [['date_epreuve', 'ASC']]
    });

    res.json({ success: true, data: epreuves });
  } catch (err) {
    console.error('[examController.getEpreuvesByEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/examens/:id/upload-sujet
 * Upload du sujet d'une épreuve
 */
exports.uploadSujet = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier téléchargé' });
    }

    // Supprimer l'ancien fichier
    if (epreuve.fichier_sujet) {
      const oldPath = path.join(__dirname, '../uploads/examens', epreuve.fichier_sujet);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await epreuve.update({ fichier_sujet: req.file.filename });

    res.json({
      success: true,
      message: 'Sujet uploadé avec succès',
      data: { fichier: req.file.filename }
    });
  } catch (err) {
    console.error('[examController.uploadSujet]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/examens/:id/upload-correction
 * Upload de la correction d'une épreuve
 */
exports.uploadCorrection = async (req, res) => {
  try {
    const epreuve = await Epreuve.findByPk(req.params.id);
    if (!epreuve) {
      return res.status(404).json({ success: false, message: 'Épreuve non trouvée' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier téléchargé' });
    }

    // Supprimer l'ancien fichier
    if (epreuve.fichier_correction) {
      const oldPath = path.join(__dirname, '../uploads/examens', epreuve.fichier_correction);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await epreuve.update({ fichier_correction: req.file.filename });

    res.json({
      success: true,
      message: 'Correction uploadée avec succès',
      data: { fichier: req.file.filename }
    });
  } catch (err) {
    console.error('[examController.uploadCorrection]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/examens/stats
 * Statistiques des épreuves
 */
exports.getExamStats = async (req, res) => {
  try {
    const { idAnnee, idClasse } = req.query;

    const where = {};
    if (idClasse) where.idClasse = idClasse;
    if (idAnnee) {
      const trimestres
