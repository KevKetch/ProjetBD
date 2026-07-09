// src/controllers/matiereController.js
const { Matiere, Classe, Enseignant, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/v1/matieres
 * Liste toutes les matières avec recherche
 * Query: search, classe_id, enseignant_id, is_active
 */
exports.listMatieres = async (req, res) => {
  try {
    const { search, classe_id, enseignant_id, is_active } = req.query;
    const where = {};
    const include = [];

    // Recherche par nom ou description
    if (search) {
      where[Op.or] = [
        { nom: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtre par statut
    if (is_active !== undefined) {
      where.is_active = is_active === 'true' ? 1 : 0;
    }

    // Filtre par classe
    if (classe_id) {
      include.push({
        model: Classe,
        as: 'classes',
        through: { attributes: [] },
        where: { id: classe_id }
      });
    }

    // Filtre par enseignant
    if (enseignant_id) {
      include.push({
        model: Enseignant,
        as: 'enseignants',
        through: { attributes: [] },
        where: { id: enseignant_id }
      });
    }

    const matieres = await Matiere.findAll({
      where,
      include,
      order: [['nom', 'ASC']]
    });

    res.json({
      success: true,
      data: matieres,
      count: matieres.length
    });
  } catch (err) {
    console.error('[matiereController.listMatieres]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des matières',
      detail: err.message
    });
  }
};

/**
 * GET /api/v1/matieres/:id
 * Détail d'une matière avec ses associations
 */
exports.getMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id, {
      include: [
        {
          model: Classe,
          as: 'classes',
          through: { attributes: [] }
        },
        {
          model: Enseignant,
          as: 'enseignants',
          through: { attributes: [] }
        }
      ]
    });

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    res.json({ success: true, data: matiere });
  } catch (err) {
    console.error('[matiereController.getMatiere]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      detail: err.message
    });
  }
};

/**
 * POST /api/v1/matieres
 * Créer une matière
 * Body: { nom, code, description, coefficient, is_active }
 */
exports.createMatiere = async (req, res) => {
  try {
    const { nom, code, description, coefficient, is_active } = req.body;

    // Vérifier si la matière existe déjà
    const existing = await Matiere.findOne({
      where: {
        [Op.or]: [
          { nom: nom },
          { code: code }
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Une matière avec ce nom ou ce code existe déjà'
      });
    }

    const matiere = await Matiere.create({
      nom,
      code: code || null,
      description: description || null,
      coefficient: coefficient || 1,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ success: true, data: matiere });
  } catch (err) {
    console.error('[matiereController.createMatiere]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
      detail: err.message
    });
  }
};

/**
 * PUT /api/v1/matieres/:id
 * Modifier une matière
 */
exports.updateMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    const { nom, code, description, coefficient, is_active } = req.body;

    // Vérifier les conflits
    if (nom || code) {
      const conflictWhere = {};
      if (nom) conflictWhere.nom = nom;
      if (code) conflictWhere.code = code;

      const conflict = await Matiere.findOne({
        where: {
          ...conflictWhere,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Une autre matière utilise ce nom ou ce code'
        });
      }
    }

    await matiere.update({
      nom: nom || matiere.nom,
      code: code !== undefined ? code : matiere.code,
      description: description !== undefined ? description : matiere.description,
      coefficient: coefficient || matiere.coefficient,
      is_active: is_active !== undefined ? is_active : matiere.is_active
    });

    res.json({ success: true, data: matiere });
  } catch (err) {
    console.error('[matiereController.updateMatiere]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      detail: err.message
    });
  }
};

/**
 * DELETE /api/v1/matieres/:id
 * Supprimer une matière (soft delete)
 */
exports.deleteMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    // Vérifier si des épreuves y sont associées
    const examCount = await matiere.countExamens();
    if (examCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${examCount} épreuve(s) associée(s) à cette matière`
      });
    }

    await matiere.destroy();
    res.json({ success: true, message: 'Matière supprimée avec succès' });
  } catch (err) {
    console.error('[matiereController.deleteMatiere]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      detail: err.message
    });
  }
};

/**
 * POST /api/v1/matieres/:id/restore
 * Restaurer une matière supprimée
 */
exports.restoreMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id, { paranoid: false });

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    await matiere.restore();
    res.json({ success: true, message: 'Matière restaurée avec succès' });
  } catch (err) {
    console.error('[matiereController.restoreMatiere]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la restauration',
      detail: err.message
    });
  }
};

/**
 * POST /api/v1/matieres/:id/assign-classe
 * Assigner une matière à une classe
 * Body: { classe_id, coefficient, enseignant_id }
 */
exports.assignToClasse = async (req, res) => {
  try {
    const { classe_id, coefficient, enseignant_id } = req.body;
    const matiereId = req.params.id;

    const matiere = await Matiere.findByPk(matiereId);
    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    const classe = await Classe.findByPk(classe_id);
    if (!classe) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Vérifier si déjà assigné
    const existing = await matiere.hasClasse(classe_id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Cette matière est déjà assignée à cette classe'
      });
    }

    // Assigner avec les options
    await matiere.addClasse(classe_id, {
      through: {
        coefficient: coefficient || 1,
        enseignant_id: enseignant_id || null
      }
    });

    // Mettre à jour le statut
    await matiere.update({ is_active: true });

    res.json({
      success: true,
      message: 'Matière assignée à la classe avec succès'
    });
  } catch (err) {
    console.error('[matiereController.assignToClasse]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'assignation',
      detail: err.message
    });
  }
};

/**
 * POST /api/v1/matieres/:id/unassign-classe/:classeId
 * Retirer une matière d'une classe
 */
exports.unassignFromClasse = async (req, res) => {
  try {
    const matiereId = req.params.id;
    const classeId = req.params.classeId;

    const matiere = await Matiere.findByPk(matiereId);
    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    // Vérifier si des épreuves existent
    const examCount = await matiere.countExamens({
      where: { classe_id: classeId }
    });

    if (examCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de retirer : ${examCount} épreuve(s) existent pour cette matière dans cette classe`
      });
    }

    await matiere.removeClasse(classeId);
    res.json({
      success: true,
      message: 'Matière retirée de la classe avec succès'
    });
  } catch (err) {
    console.error('[matiereController.unassignFromClasse]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait',
      detail: err.message
    });
  }
};

/**
 * GET /api/v1/matieres/:id/classes
 * Récupère les classes associées à une matière
 */
exports.getMatiereClasses = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id, {
      include: [{
        model: Classe,
        as: 'classes',
        through: { attributes: ['coefficient', 'enseignant_id'] }
      }]
    });

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    res.json({ success: true, data: matiere.classes });
  } catch (err) {
    console.error('[matiereController.getMatiereClasses]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      detail: err.message
    });
  }
};

/**
 * GET /api/v1/matieres/stats
 * Statistiques des matières
 */
exports.getMatiereStats = async (req, res) => {
  try {
    const total = await Matiere.count();
    const actives = await Matiere.count({ where: { is_active: 1 } });
    const inactives = await Matiere.count({ where: { is_active: 0 } });

    const parClasse = await Matiere.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('classes.id')), 'count']
      ],
      include: [{
        model: Classe,
        as: 'classes',
        attributes: [],
        through: { attributes: [] }
      }],
      group: ['Matiere.id'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        total,
        actives,
        inactives,
        parClasse: parClasse.length
      }
    });
  } catch (err) {
    console.error('[matiereController.getMatiereStats]', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      detail: err.message
    });
  }
};
