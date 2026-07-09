// src/controllers/trimestreController.js
const { Trimestre, AnneeAcademique, Sequence, Admin, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/v1/trimestres/annees
 * Liste des années académiques
 */
exports.listAnnees = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { libelle: { [Op.like]: `%${search}%` } },
        { periode: { [Op.like]: `%${search}%` } }
      ];
    }

    const annees = await AnneeAcademique.findAll({
      where,
      include: [{
        model: Trimestre,
        as: 'trimestres',
        order: [['ordre', 'ASC']]
      }],
      order: [['idAnnee', 'DESC']]
    });

    res.json({ success: true, data: annees });
  } catch (err) {
    console.error('[trimestreController.listAnnees]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/trimestres/annees
 * Créer une année académique
 */
exports.createAnnee = async (req, res) => {
  try {
    const { libelle, periode } = req.body;

    if (!libelle) {
      return res.status(400).json({
        success: false,
        message: 'Le libellé de l\'année est requis'
      });
    }

    // Vérifier si l'année existe déjà
    const existing = await AnneeAcademique.findOne({
      where: { libelle }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Cette année académique existe déjà'
      });
    }

    const annee = await AnneeAcademique.create({
      libelle,
      periode: periode || null,
      idAdmin: req.user?.idAdmin || 1
    });

    res.status(201).json({ success: true, data: annee });
  } catch (err) {
    console.error('[trimestreController.createAnnee]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/trimestres/annees/:id
 * Modifier une année académique
 */
exports.updateAnnee = async (req, res) => {
  try {
    const annee = await AnneeAcademique.findByPk(req.params.id);

    if (!annee) {
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    const { libelle, periode } = req.body;

    await annee.update({
      libelle: libelle || annee.libelle,
      periode: periode !== undefined ? periode : annee.periode
    });

    res.json({ success: true, data: annee });
  } catch (err) {
    console.error('[trimestreController.updateAnnee]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/trimestres/annees/:id
 * Supprimer une année académique (seulement si pas de trimestres)
 */
exports.deleteAnnee = async (req, res) => {
  try {
    const annee = await AnneeAcademique.findByPk(req.params.id, {
      include: [{ model: Trimestre, as: 'trimestres' }]
    });

    if (!annee) {
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    if (annee.trimestres && annee.trimestres.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${annee.trimestres.length} trimestre(s) associé(s) à cette année`
      });
    }

    await annee.destroy();
    res.json({ success: true, message: 'Année académique supprimée avec succès' });
  } catch (err) {
    console.error('[trimestreController.deleteAnnee]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/trimestres
 * Liste des trimestres avec filtres
 */
exports.listTrimestres = async (req, res) => {
  try {
    const { idAnnee, ordre, is_active } = req.query;

    const where = {};
    if (idAnnee) where.idAca = idAnnee;
    if (ordre) where.ordre = ordre;

    const trimestres = await Trimestre.findAll({
      where,
      include: [
        {
          model: AnneeAcademique,
          as: 'anneeAcademique'
        },
        {
          model: Sequence,
          as: 'sequences',
          order: [['idSequence', 'ASC']]
        }
      ],
      order: [['ordre', 'ASC']]
    });

    // Ajouter le statut actif/inactif
    const result = trimestres.map(t => ({
      ...t.toJSON(),
      is_active: t.isActive()
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[trimestreController.listTrimestres]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/trimestres/:id
 * Détail d'un trimestre
 */
exports.getTrimestre = async (req, res) => {
  try {
    const trimestre = await Trimestre.findByPk(req.params.id, {
      include: [
        {
          model: AnneeAcademique,
          as: 'anneeAcademique'
        },
        {
          model: Sequence,
          as: 'sequences',
          order: [['idSequence', 'ASC']]
        }
      ]
    });

    if (!trimestre) {
      return res.status(404).json({
        success: false,
        message: 'Trimestre non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        ...trimestre.toJSON(),
        is_active: trimestre.isActive()
      }
    });
  } catch (err) {
    console.error('[trimestreController.getTrimestre]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/trimestres
 * Créer un trimestre
 * Body: { libelle, periode, date_debut, date_fin, idAca, ordre }
 */
exports.createTrimestre = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      libelle,
      periode,
      date_debut,
      date_fin,
      idAca,
      ordre
    } = req.body;

    // Validation
    if (!libelle) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le libellé du trimestre est requis'
      });
    }

    if (!idAca) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'L\'année académique est requise'
      });
    }

    // Vérifier que l'année existe
    const annee = await AnneeAcademique.findByPk(idAca);
    if (!annee) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    // Vérifier les dates
    if (date_debut && date_fin) {
      const debut = new Date(date_debut);
      const fin = new Date(date_fin);
      if (debut > fin) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'La date de début doit être antérieure à la date de fin'
        });
      }
    }

    // Calculer l'ordre si non fourni
    let finalOrdre = ordre;
    if (!finalOrdre) {
      const maxOrdre = await Trimestre.max('ordre', {
        where: { idAca },
        transaction: t
      });
      finalOrdre = (maxOrdre || 0) + 1;
    }

    // Vérifier l'unicité de l'ordre
    const existing = await Trimestre.findOne({
      where: { idAca, ordre: finalOrdre },
      transaction: t
    });

    if (existing) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: `Un trimestre existe déjà avec l'ordre ${finalOrdre} pour cette année`
      });
    }

    // Créer la période si non fournie
    const periodeValue = periode || `${libelle} - ${annee.libelle}`;

    const trimestre = await Trimestre.create({
      libelle,
      periode: periodeValue,
      date_debut: date_debut || null,
      date_fin: date_fin || null,
      idAca,
      idAdmin: req.user?.idAdmin || 1,
      ordre: finalOrdre
    }, { transaction: t });

    await t.commit();

    const created = await Trimestre.findByPk(trimestre.idTrimes, {
      include: [{ model: AnneeAcademique, as: 'anneeAcademique' }]
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    await t.rollback();
    console.error('[trimestreController.createTrimestre]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/trimestres/:id
 * Modifier un trimestre
 */
exports.updateTrimestre = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const trimestre = await Trimestre.findByPk(req.params.id);

    if (!trimestre) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Trimestre non trouvé'
      });
    }

    const {
      libelle,
      periode,
      date_debut,
      date_fin,
      idAca,
      ordre
    } = req.body;

    // Vérifier les dates
    if (date_debut && date_fin) {
      const debut = new Date(date_debut);
      const fin = new Date(date_fin);
      if (debut > fin) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'La date de début doit être antérieure à la date de fin'
        });
      }
    }

    // Vérifier l'unicité de l'ordre si modifié
    if (ordre && ordre !== trimestre.ordre) {
      const targetAnnee = idAca || trimestre.idAca;
      const existing = await Trimestre.findOne({
        where: {
          idAca: targetAnnee,
          ordre: ordre,
          idTrimes: { [Op.ne]: req.params.id }
        },
        transaction: t
      });

      if (existing) {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: `Un trimestre existe déjà avec l'ordre ${ordre} pour cette année`
        });
      }
    }

    await trimestre.update({
      libelle: libelle || trimestre.libelle,
      periode: periode !== undefined ? periode : trimestre.periode,
      date_debut: date_debut !== undefined ? date_debut : trimestre.date_debut,
      date_fin: date_fin !== undefined ? date_fin : trimestre.date_fin,
      idAca: idAca || trimestre.idAca,
      ordre: ordre || trimestre.ordre
    }, { transaction: t });

    await t.commit();

    const updated = await Trimestre.findByPk(trimestre.idTrimes, {
      include: [{ model: AnneeAcademique, as: 'anneeAcademique' }]
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    await t.rollback();
    console.error('[trimestreController.updateTrimestre]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/trimestres/:id
 * Supprimer un trimestre (seulement si pas de séquences ou épreuves)
 */
exports.deleteTrimestre = async (req, res) => {
  try {
    const trimestre = await Trimestre.findByPk(req.params.id, {
      include: [
        { model: Sequence, as: 'sequences' },
        { model: Epreuve, as: 'epreuves' }
      ]
    });

    if (!trimestre) {
      return res.status(404).json({
        success: false,
        message: 'Trimestre non trouvé'
      });
    }

    if (trimestre.sequences && trimestre.sequences.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${trimestre.sequences.length} séquence(s) associée(s) à ce trimestre`
      });
    }

    if (trimestre.epreuves && trimestre.epreuves.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${trimestre.epreuves.length} épreuve(s) associée(s) à ce trimestre`
      });
    }

    await trimestre.destroy();
    res.json({ success: true, message: 'Trimestre supprimé avec succès' });
  } catch (err) {
    console.error('[trimestreController.deleteTrimestre]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/trimestres/current
 * Récupère le trimestre actif en cours
 */
exports.getCurrentTrimestre = async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const trimestre = await Trimestre.findOne({
      where: {
        date_debut: { [Op.lte]: today },
        date_fin: { [Op.gte]: today }
      },
      include: [{ model: AnneeAcademique, as: 'anneeAcademique' }],
      order: [['ordre', 'ASC']]
    });

    if (!trimestre) {
      return res.status(404).json({
        success: false,
        message: 'Aucun trimestre actif trouvé'
      });
    }

    res.json({ success: true, data: trimestre });
  } catch (err) {
    console.error('[trimestreController.getCurrentTrimestre]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/trimestres/generate-sequences
 * Générer automatiquement les séquences pour un trimestre
 */
exports.generateSequences = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { idTrimestre, nbSequences = 2 } = req.body;

    const trimestre = await Trimestre.findByPk(idTrimestre);
    if (!trimestre) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Trimestre non trouvé'
      });
    }

    // Supprimer les séquences existantes
    await Sequence.destroy({
      where: { idTrimestre },
      transaction: t
    });

    const sequences = [];
    const startDate = new Date(trimestre.date_debut);
    const endDate = new Date(trimestre.date_fin);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPerSequence = Math.floor(totalDays / nbSequences);

    for (let i = 0; i < nbSequences; i++) {
      const seqStart = new Date(startDate);
      seqStart.setDate(seqStart.getDate() + i * daysPerSequence);

      const seqEnd = new Date(seqStart);
      seqEnd.setDate(seqEnd.getDate() + daysPerSequence - 1);

      if (i === nbSequences - 1) {
        // Dernière séquence jusqu'à la fin
        seqEnd.setTime(endDate.getTime());
      }

      const sequence = await Sequence.create({
        libelle: `Séquence ${i + 1} - ${trimestre.libelle}`,
        description: `Séquence ${i + 1} du ${trimestre.libelle}`,
        idTrimestre: idTrimestre,
        idPers: req.user?.idPers || 1,
        date_debut: seqStart.toISOString().split('T')[0],
        date_fin: seqEnd.toISOString().split('T')[0]
      }, { transaction: t });

      sequences.push(sequence);
    }

    await t.commit();

    res.json({
      success: true,
      message: `${sequences.length} séquence(s) générée(s) avec succès`,
      data: sequences
    });
  } catch (err) {
    await t.rollback();
    console.error('[trimestreController.generateSequences]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
