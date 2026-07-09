const { Matiere } = require('../models');

/**
 * GET /api/v1/matieres
 * Liste toutes les matières (optionnel: ?classe_id=xxx)
 */
exports.listMatieres = async (req, res) => {
  try {
    const where = {};
    // Support filtre par classe si la colonne existe
    if (req.query.classe_id) {
      where.classe_id = req.query.classe_id;
    }
    const matieres = await Matiere.findAll({
      where,
      order: [['nom', 'ASC']],
    });
    res.json(matieres);
  } catch (err) {
    console.error('[matiereController.listMatieres]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /api/v1/matieres/:id
 */
exports.getMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) {
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }
    res.json(matiere);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * POST /api/v1/matieres
 * Body: { nom, coefficient, description? }
 */
exports.createMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.create(req.body);
    res.status(201).json(matiere);
  } catch (err) {
    console.error('[matiereController.createMatiere]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la création', detail: err.message });
  }
};

/**
 * PUT /api/v1/matieres/:id
 */
exports.updateMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) {
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }
    await matiere.update(req.body);
    res.json(matiere);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour', detail: err.message });
  }
};

/**
 * DELETE /api/v1/matieres/:id
 */
exports.deleteMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) {
      return res.status(404).json({ success: false, message: 'Matière non trouvée' });
    }
    await matiere.destroy();
    res.json({ success: true, message: 'Matière supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression', detail: err.message });
  }
};
