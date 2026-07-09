const { Sequence } = require('../models');

/**
 * GET /api/v1/sequences
 * Liste toutes les séquences triées par date
 */
exports.listSequences = async (req, res) => {
  try {
    const sequences = await Sequence.findAll({
      order: [['date_debut', 'ASC']],
    });
    res.json(sequences);
  } catch (err) {
    console.error('[sequenceController.listSequences]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /api/v1/sequences/:id
 */
exports.getSequence = async (req, res) => {
  try {
    const sequence = await Sequence.findByPk(req.params.id);
    if (!sequence) {
      return res.status(404).json({ success: false, message: 'Séquence non trouvée' });
    }
    res.json(sequence);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * POST /api/v1/sequences
 * Body: { libelle, date_debut, date_fin }
 */
exports.createSequence = async (req, res) => {
  try {
    const sequence = await Sequence.create(req.body);
    res.status(201).json(sequence);
  } catch (err) {
    console.error('[sequenceController.createSequence]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la création', detail: err.message });
  }
};

/**
 * PUT /api/v1/sequences/:id
 */
exports.updateSequence = async (req, res) => {
  try {
    const sequence = await Sequence.findByPk(req.params.id);
    if (!sequence) {
      return res.status(404).json({ success: false, message: 'Séquence non trouvée' });
    }
    await sequence.update(req.body);
    res.json(sequence);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour', detail: err.message });
  }
};
