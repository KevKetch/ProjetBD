// src/models/Message.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'expediteur_id',
        as: 'expediteur'
      });
      this.belongsTo(models.User, {
        foreignKey: 'destinataire_id',
        as: 'destinataire'
      });
      this.belongsTo(models.Parent, {
        foreignKey: 'parent_id',
        as: 'parent'
      });
    }
  }

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expediteur_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    destinataire_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sujet: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    corps: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'urgence', 'reclamation'),
      defaultValue: 'general'
    },
    lu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reponse_a_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Message;
};
