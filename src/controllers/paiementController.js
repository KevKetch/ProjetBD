// src/controllers/paiementController.js
const { Paiement, Eleve, Echeancier, Frais, Admin, AnneeAcademique, sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Génère un numéro de reçu unique
 */
async function generateNumeroRecu() {
  const year = new Date().getFullYear();
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
 * Vérifie si un élève est à jour dans ses paiements pour une année
 */
async function checkEleveAJour(matricule, idAnnee) {
  const echeanciers = await Echeancier.findAll({
    where: {
      idAnnee,
      is_active: true
    },
    include: [{ model: Frais, as: 'frais' }],
    order: [['ordre', 'ASC']]
  });

  if (echeanciers.length === 0) return true;

  for (const echeancier of echeanciers) {
    const estPaye = await echeancier.isPayee(matricule);
    if (!estPaye && echeancier.isEchue()) {
      return false;
    }
  }
  return true;
}

/**
 * Calcule le montant total dû pour un élève pour une année
 */
async function calculateTotalDu(matricule, idAnnee) {
  const echeanciers = await Echeancier.findAll({
    where: {
      idAnnee,
      is_active: true
    },
    order: [['ordre', 'ASC']]
  });

  let total = 0;
  for (const echeancier of echeanciers) {
    total += parseFloat(echeancier.montant);
  }
  return total;
}

/**
 * Calcule le montant total payé pour un élève pour une année
 */
async function calculateTotalPaye(matricule, idAnnee) {
  const paiements = await Paiement.findAll({
    where: {
      matricule,
      idAnnee,
      statut: 'paye'
    }
  });

  return paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0);
}

// ================================================================
// FRAIS (Fee Types)
// ================================================================

/**
 * GET /api/v1/paiements/frais
 * Liste tous les types de frais
 */
exports.listFrais = async (req, res) => {
  try {
    const frais = await Frais.findAll({
      order: [['libelle', 'ASC']]
    });
    res.json({ success: true, data: frais });
  } catch (err) {
    console.error('[paiementController.listFrais]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/frais/:id
 * Détail d'un type de frais
 */
exports.getFrais = async (req, res) => {
  try {
    const frais = await Frais.findByPk(req.params.id, {
      include: [{
        model: Echeancier,
        as: 'echeanciers',
        include: [{ model: AnneeAcademique, as: 'annee' }]
      }]
    });

    if (!frais) {
      return res.status(404).json({
        success: false,
        message: 'Type de frais non trouvé'
      });
    }

    res.json({ success: true, data: frais });
  } catch (err) {
    console.error('[paiementController.getFrais]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/paiements/frais
 * Créer un type de frais
 */
exports.createFrais = async (req, res) => {
  try {
    const { code, libelle, description } = req.body;

    if (!code || !libelle) {
      return res.status(400).json({
        success: false,
        message: 'Le code et le libellé sont requis'
      });
    }

    // Vérifier si le code existe déjà
    const existing = await Frais.findOne({ where: { code } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ce code de frais existe déjà'
      });
    }

    const frais = await Frais.create({ code, libelle, description });
    res.status(201).json({ success: true, data: frais });
  } catch (err) {
    console.error('[paiementController.createFrais]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/paiements/frais/:id
 * Modifier un type de frais
 */
exports.updateFrais = async (req, res) => {
  try {
    const frais = await Frais.findByPk(req.params.id);
    if (!frais) {
      return res.status(404).json({
        success: false,
        message: 'Type de frais non trouvé'
      });
    }

    const { code, libelle, description } = req.body;

    // Vérifier si le code existe déjà (sauf pour ce frais)
    if (code && code !== frais.code) {
      const existing = await Frais.findOne({ where: { code } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Ce code de frais existe déjà'
        });
      }
    }

    await frais.update({
      code: code || frais.code,
      libelle: libelle || frais.libelle,
      description: description !== undefined ? description : frais.description
    });

    res.json({ success: true, data: frais });
  } catch (err) {
    console.error('[paiementController.updateFrais]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/paiements/frais/:id
 * Supprimer un type de frais
 */
exports.deleteFrais = async (req, res) => {
  try {
    const frais = await Frais.findByPk(req.params.id);
    if (!frais) {
      return res.status(404).json({
        success: false,
        message: 'Type de frais non trouvé'
      });
    }

    // Vérifier si des échéanciers sont associés
    const echeanciersCount = await Echeancier.count({
      where: { idFrais: req.params.id }
    });

    if (echeanciersCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${echeanciersCount} échéancier(s) associé(s) à ce type de frais`
      });
    }

    await frais.destroy();
    res.json({ success: true, message: 'Type de frais supprimé avec succès' });
  } catch (err) {
    console.error('[paiementController.deleteFrais]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================================================
// ECHEANCIER (Tranches)
// ================================================================

/**
 * GET /api/v1/paiements/echeanciers
 * Liste des tranches avec filtres
 */
exports.listEcheanciers = async (req, res) => {
  try {
    const { idAnnee, idFrais, niveau, is_active } = req.query;

    const where = {};
    if (idAnnee) where.idAnnee = idAnnee;
    if (idFrais) where.idFrais = idFrais;
    if (niveau) where.niveau = niveau;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const echeanciers = await Echeancier.findAll({
      where,
      include: [
        { model: Frais, as: 'frais' },
        { model: AnneeAcademique, as: 'annee' }
      ],
      order: [['ordre', 'ASC']]
    });

    res.json({ success: true, data: echeanciers });
  } catch (err) {
    console.error('[paiementController.listEcheanciers]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/echeanciers/:id
 * Détail d'une tranche
 */
exports.getEcheancier = async (req, res) => {
  try {
    const echeancier = await Echeancier.findByPk(req.params.id, {
      include: [
        { model: Frais, as: 'frais' },
        { model: AnneeAcademique, as: 'annee' }
      ]
    });

    if (!echeancier) {
      return res.status(404).json({
        success: false,
        message: 'Tranche non trouvée'
      });
    }

    res.json({ success: true, data: echeancier });
  } catch (err) {
    console.error('[paiementController.getEcheancier]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/paiements/echeanciers
 * Créer une tranche
 */
exports.createEcheancier = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      libelle,
      montant,
      date_echeance,
      ordre,
      idFrais,
      idAnnee,
      niveau,
      description,
      is_active
    } = req.body;

    // Vérifications
    if (!libelle) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le libellé de la tranche est requis'
      });
    }

    if (!montant || montant <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le montant doit être supérieur à 0'
      });
    }

    if (!idFrais) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le type de frais est requis'
      });
    }

    if (!idAnnee) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'L\'année académique est requise'
      });
    }

    // Vérifier que le type de frais existe
    const frais = await Frais.findByPk(idFrais);
    if (!frais) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Type de frais non trouvé'
      });
    }

    // Vérifier que l'année existe
    const annee = await AnneeAcademique.findByPk(idAnnee);
    if (!annee) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    // Vérifier si une tranche avec le même ordre existe déjà
    if (ordre) {
      const existing = await Echeancier.findOne({
        where: {
          idAnnee,
          idFrais,
          ordre: ordre
        },
        transaction: t
      });

      if (existing) {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: `Une tranche avec l'ordre ${ordre} existe déjà pour ce type de frais et cette année`
        });
      }
    }

    // Calculer l'ordre si non fourni
    let finalOrdre = ordre;
    if (!finalOrdre) {
      const maxOrdre = await Echeancier.max('ordre', {
        where: { idAnnee, idFrais },
        transaction: t
      });
      finalOrdre = (maxOrdre || 0) + 1;
    }

    const echeancier = await Echeancier.create({
      libelle,
      montant,
      date_echeance: date_echeance || null,
      ordre: finalOrdre,
      idFrais,
      idAnnee,
      niveau: niveau || null,
      description: description || null,
      is_active: is_active !== undefined ? is_active : true
    }, { transaction: t });

    await t.commit();

    const created = await Echeancier.findByPk(echeancier.idEcheancier, {
      include: [
        { model: Frais, as: 'frais' },
        { model: AnneeAcademique, as: 'annee' }
      ]
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    await t.rollback();
    console.error('[paiementController.createEcheancier]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/paiements/echeanciers/:id
 * Modifier une tranche
 */
exports.updateEcheancier = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const echeancier = await Echeancier.findByPk(req.params.id);
    if (!echeancier) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tranche non trouvée'
      });
    }

    const {
      libelle,
      montant,
      date_echeance,
      ordre,
      niveau,
      description,
      is_active
    } = req.body;

    // Vérifier si des paiements sont associés
    const paiementsCount = await Paiement.count({
      where: { idEcheancier: req.params.id }
    });

    if (paiementsCount > 0 && montant && parseFloat(montant) !== parseFloat(echeancier.montant)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier le montant car des paiements sont associés à cette tranche'
      });
    }

    // Vérifier l'unicité de l'ordre si modifié
    if (ordre && ordre !== echeancier.ordre) {
      const existing = await Echeancier.findOne({
        where: {
          idAnnee: echeancier.idAnnee,
          idFrais: echeancier.idFrais,
          ordre: ordre,
          idEcheancier: { [Op.ne]: req.params.id }
        },
        transaction: t
      });

      if (existing) {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: `Une tranche avec l'ordre ${ordre} existe déjà pour ce type de frais et cette année`
        });
      }
    }

    await echeancier.update({
      libelle: libelle || echeancier.libelle,
      montant: montant || echeancier.montant,
      date_echeance: date_echeance !== undefined ? date_echeance : echeancier.date_echeance,
      ordre: ordre || echeancier.ordre,
      niveau: niveau !== undefined ? niveau : echeancier.niveau,
      description: description !== undefined ? description : echeancier.description,
      is_active: is_active !== undefined ? is_active : echeancier.is_active
    }, { transaction: t });

    await t.commit();

    const updated = await Echeancier.findByPk(echeancier.idEcheancier, {
      include: [
        { model: Frais, as: 'frais' },
        { model: AnneeAcademique, as: 'annee' }
      ]
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    await t.rollback();
    console.error('[paiementController.updateEcheancier]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/paiements/echeanciers/:id
 * Supprimer une tranche
 */
exports.deleteEcheancier = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const echeancier = await Echeancier.findByPk(req.params.id);
    if (!echeancier) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tranche non trouvée'
      });
    }

    // Vérifier si des paiements sont associés
    const paiementsCount = await Paiement.count({
      where: { idEcheancier: req.params.id }
    });

    if (paiementsCount > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${paiementsCount} paiement(s) associé(s) à cette tranche`
      });
    }

    await echeancier.destroy({ transaction: t });
    await t.commit();

    res.json({ success: true, message: 'Tranche supprimée avec succès' });
  } catch (err) {
    await t.rollback();
    console.error('[paiementController.deleteEcheancier]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/paiements/echeanciers/reorder
 * Réorganiser l'ordre des tranches
 */
exports.reorderEcheanciers = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { idAnnee, idFrais, ordre_ids } = req.body;

    if (!idAnnee || !idFrais || !ordre_ids || !Array.isArray(ordre_ids)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'idAnnee, idFrais et ordre_ids sont requis'
      });
    }

    for (let i = 0; i < ordre_ids.length; i++) {
      await Echeancier.update(
        { ordre: i + 1 },
        {
          where: {
            idEcheancier: ordre_ids[i],
            idAnnee,
            idFrais
          },
          transaction: t
        }
      );
    }

    await t.commit();

    const echeanciers = await Echeancier.findAll({
      where: { idAnnee, idFrais },
      include: [{ model: Frais, as: 'frais' }],
      order: [['ordre', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Ordre des tranches mis à jour',
      data: echeanciers
    });
  } catch (err) {
    await t.rollback();
    console.error('[paiementController.reorderEcheanciers]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================================================
// PAIEMENTS
// ================================================================

/**
 * GET /api/v1/paiements
 * Liste tous les paiements avec filtres
 */
exports.listPaiements = async (req, res) => {
  try {
    const { matricule, statut, idAnnee, idEcheancier, date_debut, date_fin, search } = req.query;
    const where = {};

    if (matricule) where.matricule = matricule;
    if (statut) where.statut = statut;
    if (idAnnee) where.idAnnee = idAnnee;
    if (idEcheancier) where.idEcheancier = idEcheancier;
    if (date_debut || date_fin) {
      where.date_paiement = {};
      if (date_debut) where.date_paiement[Op.gte] = date_debut;
      if (date_fin) where.date_paiement[Op.lte] = date_fin;
    }

    const include = [
      {
        model: Eleve,
        as: 'eleve',
        attributes: ['matricule', 'nom', 'prenom', 'dateNaissance']
      },
      {
        model: Echeancier,
        as: 'echeancier',
        include: [{ model: Frais, as: 'frais' }]
      },
      {
        model: Admin,
        as: 'admin',
        attributes: ['ID', 'nom', 'username']
      }
    ];

    if (search) {
      include[0].where = {
        [Op.or]: [
          { nom: { [Op.like]: `%${search}%` } },
          { prenom: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const paiements = await Paiement.findAll({
      where,
      include,
      order: [['date_paiement', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({ success: true, data: paiements });
  } catch (err) {
    console.error('[paiementController.listPaiements]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/:id
 * Détail d'un paiement
 */
exports.getPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id, {
      include: [
        {
          model: Eleve,
          as: 'eleve',
          attributes: ['matricule', 'nom', 'prenom', 'dateNaissance']
        },
        {
          model: Echeancier,
          as: 'echeancier',
          include: [{ model: Frais, as: 'frais' }]
        },
        {
          model: Admin,
          as: 'admin',
          attributes: ['ID', 'nom', 'username']
        }
      ]
    });

    if (!paiement) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.json({ success: true, data: paiement });
  } catch (err) {
    console.error('[paiementController.getPaiement]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/reçu/:numero
 * Récupérer un paiement par son numéro de reçu
 */
exports.getPaiementByReçu = async (req, res) => {
  try {
    const paiement = await Paiement.findOne({
      where: { numero_recu: req.params.numero },
      include: [
        {
          model: Eleve,
          as: 'eleve',
          attributes: ['matricule', 'nom', 'prenom']
        },
        {
          model: Echeancier,
          as: 'echeancier',
          include: [{ model: Frais, as: 'frais' }]
        }
      ]
    });

    if (!paiement) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.json({ success: true, data: paiement });
  } catch (err) {
    console.error('[paiementController.getPaiementByReçu]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/eleve/:matricule
 * Historique complet des paiements d'un élève
 */
exports.getPaiementsByEleve = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { idAnnee } = req.query;

    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    const where = { matricule };
    if (idAnnee) where.idAnnee = idAnnee;

    // Tous les paiements
    const paiements = await Paiement.findAll({
      where,
      include: [
        {
          model: Echeancier,
          as: 'echeancier',
          include: [{ model: Frais, as: 'frais' }]
        }
      ],
      order: [['date_paiement', 'DESC']]
    });

    // Résumé par type de frais
    const resumeParFrais = {};
    const totalPaye = paiements
    .filter(p => p.statut === 'paye')
    .reduce((sum, p) => sum + parseFloat(p.montant), 0);

    paiements.forEach(p => {
      const fraisLibelle = p.echeancier?.frais?.libelle || 'Autre';
      if (!resumeParFrais[fraisLibelle]) {
        resumeParFrais[fraisLibelle] = {
          libelle: fraisLibelle,
          total: 0,
          paye: 0,
          enAttente: 0,
          annule: 0
        };
      }
      resumeParFrais[fraisLibelle].total += parseFloat(p.montant);
      if (p.statut === 'paye') resumeParFrais[fraisLibelle].paye += parseFloat(p.montant);
      else if (p.statut === 'partiel') resumeParFrais[fraisLibelle].enAttente += parseFloat(p.montant);
      else if (p.statut === 'annule') resumeParFrais[fraisLibelle].annule += parseFloat(p.montant);
    });

      // Récupérer les tranches pour l'élève
      const anneeId = idAnnee || (await AnneeAcademique.findOne({ order: [['idAnnee', 'DESC']] }))?.idAnnee;

      const echeanciersActifs = await Echeancier.findAll({
        where: {
          idAnnee: anneeId,
          is_active: true,
          [Op.or]: [
            { niveau: null },
            { niveau: eleve.niveau || 'PS' }
          ]
        },
        include: [{ model: Frais, as: 'frais' }],
        order: [['ordre', 'ASC']]
      });

      // Statut des tranches pour l'élève
      const statusTranches = await Promise.all(
        echeanciersActifs.map(async (echeancier) => {
          const estPaye = await echeancier.isPayee(matricule);
          const montantRestant = await echeancier.getMontantRestant(matricule);
          const estEchue = echeancier.isEchue();

          return {
            ...echeancier.toJSON(),
                              estPaye,
                              montantRestant,
                              estEchue,
                              estEnRetard: estEchue && !estPaye
          };
        })
      );

      // Calculer le total dû
      const totalDu = await calculateTotalDu(matricule, anneeId);
      const totalPayeAnnee = await calculateTotalPaye(matricule, anneeId);

      res.json({
        success: true,
        data: {
          eleve: {
            matricule: eleve.matricule,
            nom: eleve.nom,
            prenom: eleve.prenom,
            niveau: eleve.niveau
          },
          total_du: totalDu,
          total_paye: totalPayeAnnee,
          reste_a_payer: totalDu - totalPayeAnnee,
          resume_par_frais: Object.values(resumeParFrais),
               paiements,
               tranches: statusTranches,
               est_a_jour: await checkEleveAJour(matricule, anneeId)
        }
      });
  } catch (err) {
    console.error('[paiementController.getPaiementsByEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/paiements
 * Créer un paiement
 */
exports.createPaiement = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      matricule,
      idAnnee,
      idEcheancier,
      montant,
      mode_paiement,
      statut,
      date_paiement,
      operation_ID,
      commentaire
    } = req.body;

    // Validations
    if (!matricule) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le matricule de l\'élève est requis'
      });
    }

    if (!montant || montant <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le montant doit être supérieur à 0'
      });
    }

    // Vérifier que l'élève existe
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    // Vérifier que l'année existe
    const anneeId = idAnnee || 1;
    const annee = await AnneeAcademique.findByPk(anneeId);
    if (!annee) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    // Si une tranche est spécifiée, la vérifier
    let echeancier = null;
    if (idEcheancier) {
      echeancier = await Echeancier.findByPk(idEcheancier);
      if (!echeancier) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Tranche non trouvée'
        });
      }

      // Vérifier que le montant ne dépasse pas le montant restant
      const montantRestant = await echeancier.getMontantRestant(matricule);
      if (parseFloat(montant) > montantRestant) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Le montant (${montant}) dépasse le montant restant de la tranche (${montantRestant})`
        });
      }
    }

    // Générer le numéro de reçu
    const numero_recu = await generateNumeroRecu();

    // Créer le paiement
    const paiement = await Paiement.create({
      matricule,
      idAnnee: anneeId,
      idEcheancier: idEcheancier || null,
      montant,
      mode_paiement: mode_paiement || 'especes',
      statut: statut || 'paye',
      numero_recu,
      operation_ID: operation_ID || null,
      commentaire: commentaire || null,
      date_paiement: date_paiement || new Date().toISOString().slice(0, 10),
                                           idAdmin: req.user?.ID || req.user?.id || null
    }, { transaction: t });

    await t.commit();

    const created = await Paiement.findByPk(paiement.idPaiement, {
      include: [
        {
          model: Eleve,
          as: 'eleve',
          attributes: ['matricule', 'nom', 'prenom']
        },
        {
          model: Echeancier,
          as: 'echeancier',
          include: [{ model: Frais, as: 'frais' }]
        }
      ]
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    await t.rollback();
    console.error('[paiementController.createPaiement]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/paiements/:id
 * Modifier un paiement
 */
exports.updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Vérifier que le paiement n'est pas annulé
    if (paiement.statut === 'annule') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier un paiement annulé'
      });
    }

    const { mode_paiement, statut, date_paiement, commentaire } = req.body;

    // Si le statut devient 'annule', on ne peut plus modifier
    if (statut === 'annule' && paiement.statut !== 'annule') {
      // On permet l'annulation uniquement si le paiement est récent ou par admin
      // Logique d'annulation gérée par cancelPaiement
    }

    await paiement.update({
      mode_paiement: mode_paiement ?? paiement.mode_paiement,
      statut: statut ?? paiement.statut,
      date_paiement: date_paiement ?? paiement.date_paiement,
      commentaire: commentaire ?? paiement.commentaire
    });

    const updated = await Paiement.findByPk(paiement.idPaiement, {
      include: [
        {
          model: Eleve,
          as: 'eleve',
          attributes: ['matricule', 'nom', 'prenom']
        },
        {
          model: Echeancier,
          as: 'echeancier',
          include: [{ model: Frais, as: 'frais' }]
        }
      ]
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[paiementController.updatePaiement]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/paiements/:id/annuler
 * Annuler un paiement
 */
exports.cancelPaiement = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    if (paiement.statut === 'annule') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Ce paiement est déjà annulé'
      });
    }

    await paiement.update({ statut: 'annule' }, { transaction: t });
    await t.commit();

    res.json({
      success: true,
      message: 'Paiement annulé avec succès',
      data: paiement
    });
  } catch (err) {
    await t.rollback();
    console.error('[paiementController.cancelPaiement]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/paiements/:id
 * Suppression définitive (admin seulement)
 */
exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    await paiement.destroy();
    res.json({ success: true, message: 'Paiement supprimé' });
  } catch (err) {
    console.error('[paiementController.deletePaiement]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================================================
// STATISTIQUES
// ================================================================

/**
 * GET /api/v1/paiements/stats
 * Statistiques globales des paiements
 */
exports.getStats = async (req, res) => {
  try {
    const { idAnnee, idFrais } = req.query;
    const where = {};
    if (idAnnee) where.idAnnee = idAnnee;

    // Statistiques globales
    const [global] = await Paiement.findAll({
      where,
      attributes: [
        [fn('COUNT', col('idPaiement')), 'total_paiements'],
                                            [fn('SUM', col('montant')), 'montant_total'],
                                            [fn('SUM', literal("CASE WHEN statut = 'paye' THEN montant ELSE 0 END")), 'montant_paye'],
                                            [fn('SUM', literal("CASE WHEN statut = 'annule' THEN montant ELSE 0 END")), 'montant_annule'],
                                            [fn('COUNT', literal("CASE WHEN statut = 'paye' THEN 1 END")), 'nombre_payes'],
                                            [fn('COUNT', literal("CASE WHEN statut = 'annule' THEN 1 END")), 'nombre_annules'],
                                            [fn('COUNT', literal("CASE WHEN statut = 'partiel' THEN 1 END")), 'nombre_partiels']
      ],
      raw: true
    });

    // Statistiques par type de frais
    const parFrais = await Paiement.findAll({
      where,
      attributes: [
        'idEcheancier',
        [fn('SUM', col('montant')), 'total'],
                                            [fn('COUNT', col('idPaiement')), 'count']
      ],
      include: [{
        model: Echeancier,
        as: 'echeancier',
        include: [{ model: Frais, as: 'frais' }]
      }],
      group: ['idEcheancier'],
      raw: true
    });

    // Nombre d'élèves avec paiements
    const elevesAvecPaiements = await Paiement.count({
      where,
      distinct: true,
      col: 'matricule'
    });

    res.json({
      success: true,
      data: {
        global: {
          total_paiements: parseInt(global.total_paiements) || 0,
             montant_total: parseFloat(global.montant_total) || 0,
             montant_paye: parseFloat(global.montant_paye) || 0,
             montant_annule: parseFloat(global.montant_annule) || 0,
             nombre_payes: parseInt(global.nombre_payes) || 0,
             nombre_annules: parseInt(global.nombre_annules) || 0,
             nombre_partiels: parseInt(global.nombre_partiels) || 0
        },
        par_frais: parFrais,
        eleves_avec_paiements: elevesAvecPaiements
      }
    });
  } catch (err) {
    console.error('[paiementController.getStats]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/stats/eleve/:matricule
 * Statistiques des paiements d'un élève
 */
exports.getStatsByEleve = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { idAnnee } = req.query;

    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    const where = { matricule };
    if (idAnnee) where.idAnnee = idAnnee;

    // Total des paiements
    const paiements = await Paiement.findAll({ where });

    const totalPaye = paiements
    .filter(p => p.statut === 'paye')
    .reduce((sum, p) => sum + parseFloat(p.montant), 0);

    const totalAnnule = paiements
    .filter(p => p.statut === 'annule')
    .reduce((sum, p) => sum + parseFloat(p.montant), 0);

    // Récupérer les tranches
    const anneeId = idAnnee || (await AnneeAcademique.findOne({ order: [['idAnnee', 'DESC']] }))?.idAnnee;
    const echeanciers = await Echeancier.findAll({
      where: {
        idAnnee: anneeId,
        is_active: true,
        [Op.or]: [
          { niveau: null },
          { niveau: eleve.niveau || 'PS' }
        ]
      },
      include: [{ model: Frais, as: 'frais' }],
      order: [['ordre', 'ASC']]
    });

    const totalDu = echeanciers.reduce((sum, e) => sum + parseFloat(e.montant), 0);
    const resteAPayer = totalDu - totalPaye;

    // Statut des tranches
    const statusTranches = await Promise.all(
      echeanciers.map(async (echeancier) => ({
        ...echeancier.toJSON(),
                                             estPaye: await echeancier.isPayee(matricule),
                                             montantRestant: await echeancier.getMontantRestant(matricule),
                                             estEchue: echeancier.isEchue()
      }))
    );

    const estAJour = await checkEleveAJour(matricule, anneeId);

    res.json({
      success: true,
      data: {
        eleve: {
          matricule: eleve.matricule,
          nom: eleve.nom,
          prenom: eleve.prenom,
          niveau: eleve.niveau
        },
        total_du: totalDu,
        total_paye: totalPaye,
        total_annule: totalAnnule,
        reste_a_payer: resteAPayer,
        nombre_paiements: paiements.length,
        est_a_jour: estAJour,
        tranches: statusTranches
      }
    });
  } catch (err) {
    console.error('[paiementController.getStatsByEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/paiements/rapport/impayes
 * Liste des élèves avec des paiements en retard
 */
exports.getRapportImpayes = async (req, res) => {
  try {
    const { idAnnee } = req.query;
    const anneeId = idAnnee || (await AnneeAcademique.findOne({ order: [['idAnnee', 'DESC']] }))?.idAnnee;

    // Récupérer tous les élèves actifs
    const eleves = await Eleve.findAll({
      where: { actif: 1 },
      include: [{ model: Classe, as: 'classe' }]
    });

    // Pour chaque élève, vérifier s'il a des impayés
    const elevesImpayes = [];
    for (const eleve of eleves) {
      const estAJour = await checkEleveAJour(eleve.matricule, anneeId);
      if (!estAJour) {
        const totalDu = await calculateTotalDu(eleve.matricule, anneeId);
        const totalPaye = await calculateTotalPaye(eleve.matricule, anneeId);
        const reste = totalDu - totalPaye;

        elevesImpayes.push({
          eleve: {
            matricule: eleve.matricule,
            nom: eleve.nom,
            prenom: eleve.prenom,
            classe: eleve.classe?.libelle || 'Non assigné'
          },
          total_du: totalDu,
          total_paye: totalPaye,
          reste_a_payer: reste
        });
      }
    }

    // Trier par montant restant (descendant)
    elevesImpayes.sort((a, b) => b.reste_a_payer - a.reste_a_payer);

    // Résumé
    const total_impaye = elevesImpayes.reduce((sum, e) => sum + e.reste_a_payer, 0);
    const total_eleves_impayes = elevesImpayes.length;

    res.json({
      success: true,
      data: {
        total_impaye,
        total_eleves_impayes,
        eleves: elevesImpayes
      }
    });
  } catch (err) {
    console.error('[paiementController.getRapportImpayes]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
