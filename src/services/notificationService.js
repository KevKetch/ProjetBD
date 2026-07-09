// src/services/notificationService.js
const { Notification, User, Echeancier, Paiement, Eleve, Parent, sequelize } = require('../models');
const { Op } = require('sequelize');

class NotificationService {
  /**
   * Créer une notification
   */
  async createNotification(data, options = {}) {
    const { user_id, type, titre, message, lien } = data;
    
    return await Notification.create({
      user_id,
      type,
      titre,
      message,
      lien: lien || null,
      lu: false
    }, options);
  }

  /**
   * Créer des notifications pour plusieurs utilisateurs
   */
  async createBulkNotifications(userIds, data) {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type: data.type,
      titre: data.titre,
      message: data.message,
      lien: data.lien || null,
      lu: false
    }));

    return await Notification.bulkCreate(notifications);
  }

  /**
   * Vérifier les paiements en retard et créer des notifications
   */
  async checkOverduePayments() {
    const today = new Date();
    
    const echeanciers = await Echeancier.findAll({
      where: {
        date_echeance: { [Op.lt]: today },
        is_active: true
      },
      include: [{
        model: Frais,
        as: 'frais'
      }]
    });

    for (const echeancier of echeanciers) {
      const eleves = await Eleve.findAll({
        where: {
          actif: 1,
          statut: 'actif'
        },
        include: [{
          model: Parent,
          as: 'parents',
          include: [{
            model: User,
            as: 'user'
          }]
        }]
      });

      for (const eleve of eleves) {
        const paiement = await Paiement.findOne({
          where: {
            matricule: eleve.matricule,
            idEcheancier: echeancier.idEcheancier,
            statut: 'paye'
          }
        });

        if (!paiement) {
          for (const parent of eleve.parents) {
            if (parent.user && parent.user.is_active) {
              await this.createNotification({
                user_id: parent.user.id,
                type: 'payment_overdue',
                titre: `⚠️ Paiement en retard - ${echeancier.libelle}`,
                message: `Le paiement de ${echeancier.montant} FCFA pour ${eleve.nom} ${eleve.prenom} est en retard (échéance: ${echeancier.date_echeance})`,
                lien: `/paiements/${eleve.matricule}`
              });
            }
          }
        }
      }
    }
  }

  /**
   * Vérifier les paiements à venir (7 jours avant)
   */
  async checkUpcomingPayments() {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const echeanciers = await Echeancier.findAll({
      where: {
        date_echeance: {
          [Op.gte]: today,
          [Op.lte]: sevenDaysLater
        },
        is_active: true
      },
      include: [{
        model: Frais,
        as: 'frais'
      }]
    });

    for (const echeancier of echeanciers) {
      const eleves = await Eleve.findAll({
        where: {
          actif: 1,
          statut: 'actif'
        },
        include: [{
          model: Parent,
          as: 'parents',
          include: [{
            model: User,
            as: 'user'
          }]
        }]
      });

      for (const eleve of eleves) {
        const paiement = await Paiement.findOne({
          where: {
            matricule: eleve.matricule,
            idEcheancier: echeancier.idEcheancier,
            statut: 'paye'
          }
        });

        if (!paiement) {
          for (const parent of eleve.parents) {
            if (parent.user && parent.user.is_active) {
              await this.createNotification({
                user_id: parent.user.id,
                type: 'payment_due',
                titre: `📅 Paiement à venir - ${echeancier.libelle}`,
                message: `Le paiement de ${echeancier.montant} FCFA pour ${eleve.nom} ${eleve.prenom} est dû le ${echeancier.date_echeance}`,
                lien: `/paiements/${eleve.matricule}`
              });
            }
          }
        }
      }
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  async getUserNotifications(userId, { limit = 20, page = 1, unreadOnly = false } = {}) {
    const where = { user_id: userId };
    if (unreadOnly) where.lu = false;

    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId
      }
    });

    if (!notification) {
      throw new Error('Notification non trouvée');
    }

    await notification.update({
      lu: true,
      lu_at: new Date()
    });

    return notification;
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(userId) {
    await Notification.update(
      { lu: true, lu_at: new Date() },
      { where: { user_id: userId, lu: false } }
    );

    return true;
  }
}

module.exports = new NotificationService();