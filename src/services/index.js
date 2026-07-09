// src/services/index.js
const emailService = require('./emailService');
const smsService = require('./smsService');
const pdfService = require('./pdfService');
const notificationService = require('./notificationService');

module.exports = {
  emailService,
  smsService,
  pdfService,
  notificationService
};