const { Classe, Eleve } = require('../models');

/**
 * GET /api/v1/classes
 * Liste toutes les classes
 */
exports.listClasses = async (req, res) => {
  try {
    const classes = await Classe.findAll({
      order: [['libelle', 'ASC']],
    });
    // Calculer l'effectif réel pour chaque classe
    const result = await Promise.all(
      classes.map(async (c) => {
        const effectif = await Eleve.count({ where: { classe_id: c.id } }).catch(() => 0);
        return { ...c.toJSON(), effectif };
      })
    );
    res.json(result);
  } catch (err) {
    console.error('[classeController.listClasses]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /api/v1/classes/:id
 * Détail d'une classe avec ses élèves
 */
exports.getClasse = async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id, {
      include: [{ model: Eleve }],
    });
    if (!classe) {
      return res.status(404).json({ success: false, message: 'Classe non trouvée' });
    }
    res.json(classe);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * POST /api/v1/classes
 * Créer une nouvelle classe
 * Body: { libelle, capacite }
 */
exports.createClasse = async (req, res) => {
  try {
    const classe = await Classe.create(req.body);
    res.status(201).json(classe);
  } catch (err) {
    console.error('[classeController.createClasse]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la création', detail: err.message });
  }
};

/**
 * PUT /api/v1/classes/:id
 * Modifier une classe
 */
exports.updateClasse = async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) {
      return res.status(404).json({ success: false, message: 'Classe non trouvée' });
    }
    await classe.update(req.body);
    res.json(classe);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour', detail: err.message });
  }
};

/**
 * DELETE /api/v1/classes/:id
 * Supprimer une classe (seulement si aucun élève)
 */
exports.deleteClasse = async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) {
      return res.status(404).json({ success: false, message: 'Classe non trouvée' });
    }
    const nbEleves = await Eleve.count({ where: { classe_id: req.params.id } });
    if (nbEleves > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${nbEleves} élève(s) dans cette classe`,
      });
    }
    await classe.destroy();
    res.json({ success: true, message: 'Classe supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression', detail: err.message });
  }
};
