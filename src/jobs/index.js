const Queue = require('bull');
const redisConfig = require('../config/redis');
const { sendAlertNote } = require('./sendAlertNote');
const { sendIncidentNotification } = require('./sendIncidentNotification');
const { sendAbsenceAlert } = require('./sendAbsenceAlert');

const noteQueue = new Queue('note alerts', { redis: redisConfig });
const incidentQueue = new Queue('incident alerts', { redis: redisConfig });
const absenceQueue = new Queue('absence alerts', { redis: redisConfig });

// Use the processor functions exported from job modules for clarity
const { processSendAlertNote } = require('./sendAlertNote');
const { processSendIncidentNotification } = require('./sendIncidentNotification');
const { processSendAbsenceAlert } = require('./sendAbsenceAlert');

noteQueue.process(async (job) => {
  await processSendAlertNote(job.data.note || job.data);
});

incidentQueue.process(async (job) => {
  await processSendIncidentNotification(job.data.incident || job.data);
});

absenceQueue.process(async (job) => {
  await processSendAbsenceAlert(job.data.presence || job.data);
});

exports.initQueue = () => {
  console.log('Queues initialisées');
};

exports.noteQueue = noteQueue;
exports.incidentQueue = incidentQueue;
exports.absenceQueue = absenceQueue;
