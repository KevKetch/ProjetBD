const { Paiement, Eleve } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

async function generateNumeroRecu() {
  const year = new Date().getFullYear();
  // Bornes de dates plutôt qu'un YEAR(created_at) spécifique à MySQL,
  // pour rester compatible avec le dialecte sqlite utilisé en test.
  const count = await Paiement.count({
    where: {
      created_at: {
        [Op.gte]: new Date(`${year}-01-01T00:00:00.000Z`),
        [Op.lt]: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
  return `REC-${year}-${String(count + 1).padStart(4, '0')}`;
}

/**
 * GET /api/v1/paiements
 * Liste tous les paiements, avec filtres optionnels.
 * Query: matricule, statut, idAnnee, date_debut, date_fin, search
 */
exports.listPaiements = async (req, res) => {
  try {
    const { matricule, statut, idAnnee, date_debut, date_fin, search } = req.query;
    const where = {};

    if (matricule) where.matricule = matricule;
    if (statut) where.statut = statut;
    if (idAnnee) where.idAnnee = idAnnee;
    if (date_debut || date_fin) {
      where.date_paiement = {};
      if (date_debut) where.date_paiement[Op.gte] = date_debut;
      if (date_fin) where.date_paiement[Op.lte] = date_fin;
    }

    const include = [{ model: Eleve, attributes: ['matricule', 'nom', 'prenom'] }];

    if (search) {
      include[0].where = {
        [Op.or]: [
          { nom: { [Op.like]: `%${search}%` } },
          { prenom: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const paiements = await Paiement.findAll({
      where,
      include,
      order: [['date_paiement', 'DESC'], ['created_at', 'DESC']],
    });

    res.json(paiements);
  } catch (err) {
    console.error('[paiementController.listPaiements]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /api/v1/paiements/:id
 */
exports.getPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id, {
      include: [{ model: Eleve, attributes: ['matricule', 'nom', 'prenom'] }],
    });
    if (!paiement) {
      return res.status(404).json({ success: false, message: 'Paiement non trouvé' });
    }
    res.json(paiement);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * GET /api/v1/paiements/eleve/:matricule
 * Historique des paiements d'un élève + total versé.
 */
exports.getPaiementsByEleve = async (req, res) => {
  try {
    const { matricule } = req.params;
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    }

    const paiements = await Paiement.findAll({
      where: { matricule },
      order: [['date_paiement', 'DESC']],
    });

    const total_paye = paiements
      .filter((p) => p.statut === 'paye')
      .reduce((sum, p) => sum + parseFloat(p.montant), 0);

    res.json({ eleve: { matricule: eleve.matricule, nom: eleve.nom, prenom: eleve.prenom }, total_paye, paiements });
  } catch (err) {
    console.error('[paiementController.getPaiementsByEleve]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

/**
 * POST /api/v1/paiements
 * Body: { matricule, idAnnee, montant, mode_paiement, statut, date_paiement,
 *         operation_ID, commentaire }
 */
exports.createPaiement = async (req, res) => {
  try {
    const {
      matricule, idAnnee, montant, mode_paiement, statut,
      date_paiement, operation_ID, commentaire,
    } = req.body;

    if (!matricule || !montant) {
      return res.status(400).json({ success: false, message: 'matricule et montant sont requis' });
    }

    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      return res.status(404).json({ success: false, message: 'Élève non trouvé' });
    }

    const numero_recu = await generateNumeroRecu();

    const paiement = await Paiement.create({
      matricule,
      idAnnee: idAnnee || 1,
      montant,
      mode_paiement: mode_paiement || 'especes',
      statut: statut || 'paye',
      numero_recu,
      operation_ID: operation_ID || null,
      commentaire: commentaire || null,
      date_paiement: date_paiement || new Date().toISOString().slice(0, 10),
      enregistre_par_id: req.user?.id || req.user?.ID || null,
    });

    res.status(201).json(paiement);
  } catch (err) {
    console.error('[paiementController.createPaiement]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la création', detail: err.message });
  }
};

/**
 * PUT /api/v1/paiements/:id
 * Ne permet de modifier que mode_paiement, statut, date_paiement, commentaire
 * (montant et matricule restent figés après création, comme un vrai reçu).
 */
exports.updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ success: false, message: 'Paiement non trouvé' });
    }

    const { mode_paiement, statut, date_paiement, commentaire } = req.body;
    await paiement.update({
      mode_paiement: mode_paiement ?? paiement.mode_paiement,
      statut: statut ?? paiement.statut,
      date_paiement: date_paiement ?? paiement.date_paiement,
      commentaire: commentaire ?? paiement.commentaire,
    });

    res.json(paiement);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour', detail: err.message });
  }
};

/**
 * POST /api/v1/paiements/:id/annuler
 */
exports.cancelPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ success: false, message: 'Paiement non trouvé' });
    }
    if (paiement.statut === 'annule') {
      return res.status(400).json({ success: false, message: 'Ce paiement est déjà annulé' });
    }
    await paiement.update({ statut: 'annule' });
    res.json(paiement);
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur lors de l'annulation", detail: err.message });
  }
};

/**
 * DELETE /api/v1/paiements/:id
 * Suppression définitive (admin/directeur seulement, voir routes).
 */
exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ success: false, message: 'Paiement non trouvé' });
    }
    await paiement.destroy();
    res.json({ success: true, message: 'Paiement supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression', detail: err.message });
  }
};

/**
 * GET /api/v1/paiements/stats
 * Query: idAnnee
 */
exports.getStats = async (req, res) => {
  try {
    const { idAnnee } = req.query;
    const where = {};
    if (idAnnee) where.idAnnee = idAnnee;

    const [row] = await Paiement.findAll({
      where,
      attributes: [
        [fn('COUNT', col('id')), 'total_paiements'],
        [fn('SUM', col('montant')), 'montant_total'],
        [fn('SUM', literal("CASE WHEN statut = 'paye' THEN montant ELSE 0 END")), 'montant_paye'],
        [fn('SUM', literal("CASE WHEN statut = 'annule' THEN montant ELSE 0 END")), 'montant_annule'],
        [fn('COUNT', literal("CASE WHEN statut = 'paye' THEN 1 END")), 'nombre_payes'],
        [fn('COUNT', literal("CASE WHEN statut = 'annule' THEN 1 END")), 'nombre_annules'],
      ],
      raw: true,
    });

    res.json(row || {
      total_paiements: 0, montant_total: 0, montant_paye: 0,
      montant_annule: 0, nombre_payes: 0, nombre_annules: 0,
    });
  } catch (err) {
    console.error('[paiementController.getStats]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};
