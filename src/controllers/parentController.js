// src/controllers/parentController.js
const { Parent, Eleve, User, Personne, Note, Matiere, Sequence, Trimestre, 
        Incident, TypeIncident, Message, Enseignant, Rapport, sequelize } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

/**
 * GET /api/v1/parents/me
 * Récupère le profil du parent connecté
 */
exports.getMyProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({
      where: { user_id: req.user.id },
      include: [
        { 
          model: Personne, 
          as: 'personne',
          attributes: ['idPers', 'nom', 'prenom', 'phone', 'address']
        },
        {
          model: Eleve,
          as: 'eleve',
          attributes: ['matricule', 'nom', 'prenom', 'dateNaissance', 'sexe', 'classe_id']
        }
      ]
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    // Récupérer tous les enfants du parent
    const enfants = await Parent.findAll({
      where: { idPers: parent.idPers },
      include: [{
        model: Eleve,
        as: 'eleve',
        include: [{
          model: Classe,
          as: 'classe',
          attributes: ['idClasse', 'libelle']
        }]
      }]
    });

    res.json({
      success: true,
      data: {
        parent,
        enfants: enfants.map(e => e.eleve).filter(Boolean)
      }
    });
  } catch (err) {
    console.error('[parentController.getMyProfile]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/enfants
 * Récupère la liste des enfants du parent
 */
exports.getMyChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    const enfants = await Parent.findAll({
      where: { idPers: parent.idPers },
      include: [{
        model: Eleve,
        as: 'eleve',
        include: [
          {
            model: Classe,
            as: 'classe',
            attributes: ['idClasse', 'libelle']
          },
          {
            model: Note,
            as: 'notes',
            include: [
              { model: Matiere, as: 'matiere' },
              { model: Sequence, as: 'sequence' }
            ],
            limit: 5,
            order: [['created_at', 'DESC']]
          }
        ]
      }]
    });

    const result = enfants.map(e => e.eleve).filter(Boolean);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[parentController.getMyChildren]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/enfants/:matricule/notes
 * Récupère les notes d'un enfant spécifique
 */
exports.getChildNotes = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { idSequence } = req.query;

    // Vérifier que l'enfant appartient au parent
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    // Vérifier que l'enfant est lié au parent
    const childParent = await Parent.findOne({
      where: {
        idPers: parent.idPers,
        matricule: matricule
      }
    });

    if (!childParent) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à voir les notes de cet élève'
      });
    }

    const where = { matricule };
    if (idSequence) where.idSequence = idSequence;

    const notes = await Note.findAll({
      where,
      include: [
        { 
          model: Matiere, 
          as: 'matiere',
          attributes: ['idMatiere', 'nom', 'coefficient']
        },
        { 
          model: Sequence, 
          as: 'sequence',
          attributes: ['idSequence', 'libelle']
        },
        { 
          model: Trimestre, 
          as: 'trimestre',
          attributes: ['idTrimes', 'libelle']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Calculer les moyennes par matière
    const moyennesParMatiere = {};
    notes.forEach(note => {
      const matiereId = note.matiere?.idMatiere;
      if (matiereId) {
        if (!moyennesParMatiere[matiereId]) {
          moyennesParMatiere[matiereId] = {
            matiere: note.matiere.nom,
            coefficient: note.matiere.coefficient,
            notes: [],
            total: 0,
            count: 0
          };
        }
        moyennesParMatiere[matiereId].notes.push(note.valeur);
        moyennesParMatiere[matiereId].total += parseFloat(note.valeur);
        moyennesParMatiere[matiereId].count++;
      }
    });

    // Calculer les moyennes
    Object.keys(moyennesParMatiere).forEach(key => {
      const m = moyennesParMatiere[key];
      m.moyenne = m.count > 0 ? (m.total / m.count).toFixed(2) : null;
    });

    res.json({
      success: true,
      data: {
        notes,
        moyennes: Object.values(moyennesParMatiere)
      }
    });
  } catch (err) {
    console.error('[parentController.getChildNotes]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/enfants/:matricule/bulletin
 * Récupère le bulletin d'un enfant
 */
exports.getChildBulletin = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { idSequence } = req.query;

    // Vérifier l'accès
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    const childParent = await Parent.findOne({
      where: {
        idPers: parent.idPers,
        matricule: matricule
      }
    });

    if (!childParent) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à voir le bulletin de cet élève'
      });
    }

    const where = { matricule };
    if (idSequence) where.idSequence = idSequence;

    const bulletin = await Rapport.findOne({
      where,
      include: [
        {
          model: Eleve,
          as: 'eleve',
          attributes: ['matricule', 'nom', 'prenom', 'dateNaissance']
        },
        {
          model: Sequence,
          as: 'sequence',
          attributes: ['idSequence', 'libelle']
        },
        {
          model: Trimestre,
          as: 'trimestre',
          attributes: ['idTrimes', 'libelle']
        },
        {
          model: RapportLigne,
          as: 'lignes',
          include: [
            {
              model: Matiere,
              as: 'matiere',
              attributes: ['idMatiere', 'nom', 'coefficient']
            }
          ]
        }
      ]
    });

    if (!bulletin) {
      return res.status(404).json({
        success: false,
        message: 'Bulletin non trouvé pour cette séquence'
      });
    }

    res.json({ success: true, data: bulletin });
  } catch (err) {
    console.error('[parentController.getChildBulletin]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/enfants/:matricule/discipline
 * Récupère la discipline d'un enfant
 */
exports.getChildDiscipline = async (req, res) => {
  try {
    const { matricule } = req.params;

    // Vérifier l'accès
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    const childParent = await Parent.findOne({
      where: {
        idPers: parent.idPers,
        matricule: matricule
      }
    });

    if (!childParent) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à voir la discipline de cet élève'
      });
    }

    const incidents = await Incident.findAll({
      where: { matricule },
      include: [
        { 
          model: TypeIncident, 
          as: 'typeIncident',
          attributes: ['id', 'nom']
        },
        {
          model: Enseignant,
          as: 'enseignant',
          include: [{
            model: Personne,
            as: 'personne',
            attributes: ['nom', 'prenom']
          }]
        },
        {
          model: Sanction,
          as: 'sanction',
          attributes: ['type_sanction', 'description', 'date']
        }
      ],
      order: [['event_date', 'DESC']]
    });

    // Statistiques
    const stats = {
      total: incidents.length,
      parType: {},
      parGravite: {
        faible: 0,
        moyenne: 0,
        eleve: 0
      }
    };

    incidents.forEach(inc => {
      // Par type
      const typeNom = inc.typeIncident?.nom || 'Inconnu';
      stats.parType[typeNom] = (stats.parType[typeNom] || 0) + 1;

      // Par gravité
      if (inc.gravite <= 2) stats.parGravite.faible++;
      else if (inc.gravite <= 3) stats.parGravite.moyenne++;
      else stats.parGravite.eleve++;
    });

    res.json({
      success: true,
      data: {
        incidents,
        statistiques: stats
      }
    });
  } catch (err) {
    console.error('[parentController.getChildDiscipline]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/enfants/:matricule/rapport
 * Rapport complet d'un enfant (notes + discipline + absences)
 */
exports.getChildFullReport = async (req, res) => {
  try {
    const { matricule } = req.params;

    // Vérifier l'accès
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    const childParent = await Parent.findOne({
      where: {
        idPers: parent.idPers,
        matricule: matricule
      }
    });

    if (!childParent) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à voir le rapport de cet élève'
      });
    }

    // Récupérer l'élève
    const eleve = await Eleve.findByPk(matricule, {
      include: [
        {
          model: Classe,
          as: 'classe',
          attributes: ['idClasse', 'libelle']
        }
      ]
    });

    if (!eleve) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    // Notes
    const notes = await Note.findAll({
      where: { matricule },
      include: [
        { model: Matiere, as: 'matiere' },
        { model: Sequence, as: 'sequence' }
      ],
      order: [['created_at', 'DESC']],
      limit: 20
    });

    // Discipline
    const incidents = await Incident.findAll({
      where: { matricule },
      include: [
        { model: TypeIncident, as: 'typeIncident' },
        { model: Sanction, as: 'sanction' }
      ],
      order: [['event_date', 'DESC']],
      limit: 10
    });

    // Absences
    const presences = await Presence.findAll({
      where: { 
        matricule,
        statut: 'absent'
      },
      order: [['date', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        eleve,
        notes,
        incidents,
        absences: presences,
        total_absences: await Presence.count({
          where: { matricule, statut: 'absent' }
        })
      }
    });
  } catch (err) {
    console.error('[parentController.getChildFullReport]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/parents/messages
 * Envoyer un message à un enseignant ou à l'école
 */
exports.sendMessage = async (req, res) => {
  try {
    const { destinataire_id, sujet, message, type = 'general' } = req.body;

    if (!destinataire_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Destinataire et message requis'
      });
    }

    // Vérifier que le parent existe
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    // Vérifier que le destinataire existe et est un enseignant ou admin
    const destinataire = await User.findByPk(destinataire_id);
    if (!destinataire) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }

    // Créer le message
    const newMessage = await Message.create({
      expediteur_id: req.user.id,
      destinataire_id: destinataire_id,
      sujet: sujet || `Message de ${req.user.nom} ${req.user.prenom}`,
      corps: message,
      type: type,
      lu: false,
      parent_id: parent.idParent
    });

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: newMessage
    });
  } catch (err) {
    console.error('[parentController.sendMessage]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/messages
 * Récupère les messages du parent
 */
exports.getMessages = async (req, res) => {
  try {
    const parent = await Parent.findOne({
      where: { user_id: req.user.id }
    });

    if (!parent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Parent non trouvé' 
      });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: req.user.id },
          { destinataire_id: req.user.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'expediteur',
          attributes: ['id', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'destinataire',
          attributes: ['id', 'nom', 'prenom']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error('[parentController.getMessages]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/parents/change-password
 * Changer le mot de passe du parent
 */
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(current_password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (err) {
    console.error('[parentController.changePassword]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/v1/parents/destinataires
 * Récupère la liste des destinataires possibles (enseignants, direction)
 */
exports.getDestinataires = async (req, res) => {
  try {
    // Récupérer les enseignants et la direction
    const destinataires = await User.findAll({
      where: {
        role: {
          [Op.in]: ['enseignant', 'directeur', 'admin']
        },
        is_active: 1
      },
      attributes: ['id', 'nom', 'prenom', 'email', 'role']
    });

    res.json({ success: true, data: destinataires });
  } catch (err) {
    console.error('[parentController.getDestinataires]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/parents/create-from-eleve
 * Créer un compte parent lors de la création d'un élève
 */
exports.createParentFromEleve = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { 
      matricule, 
      parent_nom, 
      parent_prenom, 
      parent_telephone, 
      parent_email,
      relation = 'tuteur',
      is_primary = false
    } = req.body;

    // Vérifier que l'élève existe
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    // Vérifier si un parent existe déjà pour cet élève
    const existingParent = await Parent.findOne({
      where: { matricule, idPers: req.user?.idPers }
    });

    if (existingParent) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Un parent existe déjà pour cet élève'
      });
    }

    // Créer la personne
    const personne = await Personne.create({
      nom: parent_nom,
      prenom: parent_prenom,
      phone: parent_telephone,
      created_at: new Date()
    }, { transaction: t });

    // Créer l'utilisateur (mot de passe = numéro de téléphone)
    const hashedPassword = await bcrypt.hash(parent_telephone, 10);
    const user = await User.create({
      email: parent_email || `${parent_prenom.toLowerCase()}.${parent_nom.toLowerCase()}@parent.ecole.cm`,
      password: hashedPassword,
      nom: parent_nom,
      prenom: parent_prenom,
      role: 'parent',
      is_active: 1,
      person_id: personne.idPers,
      mobile: parent_telephone
    }, { transaction: t });

    // Créer le parent
    const parent = await Parent.create({
      idPers: personne.idPers,
      matricule: matricule,
      user_id: user.id,
      idAdmin: req.user?.idAdmin || 1,
      relation: relation,
      is_primary: is_primary
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Compte parent créé avec succès',
      data: {
        parent,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          mot_de_passe_defaut: parent_telephone
        }
      }
    });
  } catch (err) {
    await t.rollback();
    console.error('[parentController.createParentFromEleve]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};