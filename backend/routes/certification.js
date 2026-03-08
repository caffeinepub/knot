const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// GET /api/certification/practical-pending — pending practical video submissions
// Must be before /:workerId
router.get('/practical-pending', (req, res) => {
  const db = readDB();
  const pending = db.practicalVideoSubmissions.filter(s => s.status === 'pending');
  res.json(pending);
});

// GET /api/certification/practical-status/:workerId
router.get('/practical-status/:workerId', (req, res) => {
  const db = readDB();
  const workerId = parseInt(req.params.workerId, 10);
  const sub = db.practicalVideoSubmissions.find(s => s.workerId === workerId);
  res.json(sub ? sub.status : 'none');
});

// GET /api/certification/:workerId — get certification for a worker
router.get('/:workerId', (req, res) => {
  const db = readDB();
  const workerId = parseInt(req.params.workerId, 10);
  const cert = db.certificationResults.find(c => c.workerId === workerId);
  res.json(cert || null);
});

// POST /api/certification/submit-test — submit MCQ test result
router.post('/submit-test', (req, res) => {
  const db = readDB();
  const { workerId, mcqScore, practicalPassed } = req.body;

  if (workerId === undefined || mcqScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const wId = parseInt(workerId, 10);
  const score = parseInt(mcqScore, 10);
  const passed = score >= 6;

  // Find or create cert record
  let cert = db.certificationResults.find(c => c.workerId === wId);
  const worker = db.users.find(u => u.id === wId);

  if (cert) {
    cert.mcqScore = score;
    cert.practicalPassed = !!practicalPassed;
    cert.passed = passed && !!practicalPassed;
  } else {
    cert = {
      workerId: wId,
      skill: worker ? worker.skill : 'General',
      level: 'Basic',
      passed: passed && !!practicalPassed,
      issuedDate: passed ? Date.now() : 0,
      certificateId: passed ? `KNOT-${Date.now().toString(36).toUpperCase()}-${wId}` : '',
      mcqScore: score,
      practicalPassed: !!practicalPassed,
      pendingReview: passed && !practicalPassed,
    };
    db.certificationResults.push(cert);
  }

  writeDB(db);
  res.json(passed);
});

// POST /api/certification/submit-practical — submit practical video
router.post('/submit-practical', (req, res) => {
  const db = readDB();
  const { workerId, workerName, skill, videoDataURI } = req.body;

  if (workerId === undefined) {
    return res.status(400).json({ error: 'Missing workerId' });
  }

  const wId = parseInt(workerId, 10);

  // Update or create practical submission
  const existing = db.practicalVideoSubmissions.findIndex(s => s.workerId === wId);
  const submission = {
    workerId: wId,
    workerName: workerName || 'Unknown',
    skill: skill || 'General',
    videoDataURI: videoDataURI || '',
    status: 'pending',
    submittedAt: Date.now(),
  };

  if (existing >= 0) {
    db.practicalVideoSubmissions[existing] = submission;
  } else {
    db.practicalVideoSubmissions.push(submission);
  }

  // Mark cert as pending review
  let cert = db.certificationResults.find(c => c.workerId === wId);
  if (cert) {
    cert.pendingReview = true;
  } else {
    const worker = db.users.find(u => u.id === wId);
    cert = {
      workerId: wId,
      skill: skill || (worker ? worker.skill : 'General'),
      level: 'Basic',
      passed: false,
      issuedDate: 0,
      certificateId: '',
      mcqScore: 0,
      practicalPassed: false,
      pendingReview: true,
    };
    db.certificationResults.push(cert);
  }

  writeDB(db);
  res.json({ success: true });
});

// POST /api/certification/approve/:workerId — admin approves practical video
router.post('/approve/:workerId', (req, res) => {
  const db = readDB();
  const workerId = parseInt(req.params.workerId, 10);

  const sub = db.practicalVideoSubmissions.find(s => s.workerId === workerId);
  if (sub) sub.status = 'approved';

  let cert = db.certificationResults.find(c => c.workerId === workerId);
  const worker = db.users.find(u => u.id === workerId);

  if (cert) {
    cert.passed = true;
    cert.practicalPassed = true;
    cert.pendingReview = false;
    cert.issuedDate = Date.now();
    cert.certificateId = `KNOT-${Date.now().toString(36).toUpperCase()}-${workerId}`;
    cert.workerName = worker ? worker.name : (sub ? sub.workerName : 'Worker');
  } else {
    cert = {
      workerId,
      skill: sub ? sub.skill : (worker ? worker.skill : 'General'),
      level: 'Basic',
      passed: true,
      issuedDate: Date.now(),
      certificateId: `KNOT-${Date.now().toString(36).toUpperCase()}-${workerId}`,
      mcqScore: 0,
      practicalPassed: true,
      pendingReview: false,
      workerName: worker ? worker.name : (sub ? sub.workerName : 'Worker'),
    };
    db.certificationResults.push(cert);
  }

  writeDB(db);
  res.json(true);
});

// POST /api/certification/reject/:workerId — admin rejects practical video
router.post('/reject/:workerId', (req, res) => {
  const db = readDB();
  const workerId = parseInt(req.params.workerId, 10);

  const sub = db.practicalVideoSubmissions.find(s => s.workerId === workerId);
  if (sub) sub.status = 'rejected';

  const cert = db.certificationResults.find(c => c.workerId === workerId);
  if (cert) {
    cert.passed = false;
    cert.practicalPassed = false;
    cert.pendingReview = false;
  }

  writeDB(db);
  res.json(true);
});

module.exports = router;
