// src/jobs/index.js
// Bull/Redis queue stubs — queues are disabled when Redis is not available.
// This file exports no-op stubs so requiring code doesn't crash.

const stub = {
  add:     async () => null,
  process: () => {},
  on:      () => {},
  close:   async () => {},
};

exports.initQueue     = () => console.log('[Jobs] Redis non configuré — notifications désactivées.');
exports.noteQueue     = stub;
exports.incidentQueue = stub;
exports.absenceQueue  = stub;
