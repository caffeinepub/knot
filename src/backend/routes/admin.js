const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// Admin credentials (plain text check — frontend already handles hash)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_PLAINTEXT = 'knot@admin2026';
// SHA-256 of "knot@admin2026"
const ADMIN_PASSWORD_HASH = '4aee17e147a0be1a895dee08b461df414f985c15f3e119b6e4e3c836f95ad6b3';

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const db = readDB();
  const totalCertified = db.certificationResults.filter(c => c.passed).length;
  res.json({
    totalWorkers: db.users.length,
    totalCitizens: db.citizens.length,
    totalCertified,
    totalRequests: db.learningRequests.length,
  });
});

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, passwordHash } = req.body;
  if (
    username === ADMIN_USERNAME &&
    (passwordHash === ADMIN_PASSWORD_HASH || passwordHash === ADMIN_PASSWORD_PLAINTEXT)
  ) {
    return res.json(true);
  }
  res.json(false);
});

// POST /api/admin/clear — clear all data
router.post('/clear', (req, res) => {
  writeDB({
    users: [],
    citizens: [],
    learningRequests: [],
    certificationResults: [],
    practicalVideoSubmissions: [],
    videoStore: [],
    workerCredentials: [],
    citizenCredentials: [],
    nextUserId: 1,
    nextCitizenId: 1,
    nextRequestId: 1,
  });
  res.json({ success: true });
});

module.exports = router;
