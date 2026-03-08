const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// GET /api/learning-requests — all learning requests
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.learningRequests);
});

// GET /api/learning-requests/worker/:workerId — requests for a specific worker
router.get('/worker/:workerId', (req, res) => {
  const db = readDB();
  const workerId = parseInt(req.params.workerId, 10);
  const results = db.learningRequests.filter(r => r.targetUserId === workerId);
  res.json(results);
});

// POST /api/learning-requests — submit a learning request
router.post('/', (req, res) => {
  const db = readDB();
  const { requesterId, targetUserId, message } = req.body;

  if (!requesterId || targetUserId === undefined || targetUserId === null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = db.nextRequestId;
  db.nextRequestId += 1;

  const newRequest = {
    id,
    requesterId,
    targetUserId: parseInt(targetUserId, 10),
    message: message || '',
    timestamp: Date.now(),
  };

  db.learningRequests.push(newRequest);
  writeDB(db);
  res.json({ success: true, id });
});

module.exports = router;
