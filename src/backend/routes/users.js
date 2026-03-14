const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');
const { calculateBadge } = require('../utils/badge');

// Rank formula: trustScore*2 + endorsementCount (descending)
function rankScore(u) {
  return (u.trustScore * 2) + u.endorsementCount;
}

// GET /api/users — all users sorted by rank
router.get('/', (req, res) => {
  const db = readDB();
  const sorted = [...db.users].sort((a, b) => rankScore(b) - rankScore(a));
  res.json(sorted);
});

// GET /api/users/search?q=... — search by name or skill (must come before /:id)
router.get('/search', (req, res) => {
  const db = readDB();
  const q = (req.query.q || '').toString().toLowerCase().trim();
  if (!q) {
    const sorted = [...db.users].sort((a, b) => rankScore(b) - rankScore(a));
    return res.json(sorted);
  }
  const results = db.users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.skill.toLowerCase().includes(q) ||
    (u.location || '').toLowerCase().includes(q)
  ).sort((a, b) => rankScore(b) - rankScore(a));
  res.json(results);
});

// GET /api/users/skill/:skill — by skill
router.get('/skill/:skill', (req, res) => {
  const db = readDB();
  const skill = req.params.skill;
  if (skill === 'All') {
    return res.json(db.users.sort((a, b) => rankScore(b) - rankScore(a)));
  }
  const results = db.users
    .filter(u => u.skill.toLowerCase() === skill.toLowerCase())
    .sort((a, b) => rankScore(b) - rankScore(a));
  res.json(results);
});

// GET /api/users/distance/:maxKm — by distance
router.get('/distance/:maxKm', (req, res) => {
  const db = readDB();
  const maxKm = parseInt(req.params.maxKm, 10) || 20;
  const results = db.users
    .filter(u => (u.distance || 5) <= maxKm)
    .sort((a, b) => rankScore(b) - rankScore(a));
  res.json(results);
});

// GET /api/users/stats/:id — same as getUser (alias)
router.get('/stats/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id, 10);
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// GET /api/users/find-by-name/:name — find by name (case-insensitive)
router.get('/find-by-name/:name', (req, res) => {
  const db = readDB();
  const name = decodeURIComponent(req.params.name).toLowerCase().trim();
  const user = db.users.find(u => u.name.toLowerCase().trim() === name);
  res.json(user || null);
});

// GET /api/users/:id — get single user
router.get('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id, 10);
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/users/register — register a new worker
router.post('/register', (req, res) => {
  const db = readDB();
  const { username, passwordHash, name, skill, location, bio, videoURL, distance, contact } = req.body;

  if (!username || !passwordHash || !name || !skill || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if username already exists
  const existingCred = db.workerCredentials.find(c => c.username === username.toLowerCase());
  if (existingCred) {
    // Return existing user
    const existingUser = db.users.find(u => u.id === existingCred.userId);
    if (existingUser) {
      return res.json({ id: existingUser.id });
    }
  }

  const id = db.nextUserId;
  db.nextUserId += 1;

  const newUser = {
    id,
    name,
    skill,
    location,
    trustScore: 0,
    endorsementCount: 0,
    badgeLevel: 'None',
    distance: distance || 5,
    bio: bio || '',
    videoURL: videoURL || '',
    contact: contact || '',
  };

  db.users.push(newUser);
  db.workerCredentials.push({
    userId: id,
    username: username.toLowerCase(),
    passwordHash,
  });

  writeDB(db);
  res.json({ id });
});

// POST /api/users/login — login worker
router.post('/login', (req, res) => {
  const db = readDB();
  const { username, passwordHash } = req.body;

  const cred = db.workerCredentials.find(
    c => c.username === (username || '').toLowerCase() && c.passwordHash === passwordHash
  );
  if (!cred) return res.json(null);

  const user = db.users.find(u => u.id === cred.userId);
  res.json(user || null);
});

// POST /api/users/endorse/:id — endorse a user
router.post('/endorse/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id, 10);
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.endorsementCount += 1;
  user.trustScore += 1;
  user.badgeLevel = calculateBadge(user.endorsementCount);

  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
