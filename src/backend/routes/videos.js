const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// POST /api/videos/save — save worker video as base64 data URI
router.post('/save', (req, res) => {
  const db = readDB();
  const { workerId, dataURI } = req.body;

  if (workerId === undefined || !dataURI) {
    return res.status(400).json({ error: 'Missing workerId or dataURI' });
  }

  const wId = parseInt(workerId, 10);
  const existing = db.videoStore.findIndex(v => v.workerId === wId);

  if (existing >= 0) {
    db.videoStore[existing].dataURI = dataURI;
  } else {
    db.videoStore.push({ workerId: wId, dataURI });
  }

  writeDB(db);
  res.json({ success: true });
});

// GET /api/videos/:workerId — get worker video data URI
router.get('/:workerId', (req, res) => {
  const db = readDB();
  const wId = parseInt(req.params.workerId, 10);
  const entry = db.videoStore.find(v => v.workerId === wId);
  res.json(entry ? entry.dataURI : '');
});

module.exports = router;
