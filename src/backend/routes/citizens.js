const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// GET /api/citizens — all citizens (admin)
router.get('/', (req, res) => {
  const db = readDB();
  // Return without passwordHash
  const safe = db.citizens.map(({ passwordHash: _ph, ...c }) => c);
  res.json(safe);
});

// GET /api/citizens/find-by-name/:name — find citizen by name
router.get('/find-by-name/:name', (req, res) => {
  const db = readDB();
  const name = decodeURIComponent(req.params.name).toLowerCase().trim();
  const citizen = db.citizens.find(c => c.name.toLowerCase().trim() === name);
  if (!citizen) return res.json(null);
  const { passwordHash: _ph, ...safe } = citizen;
  res.json(safe);
});

// POST /api/citizens/register — register a citizen
router.post('/register', (req, res) => {
  const db = readDB();
  const { name, address, username, passwordHash } = req.body;

  if (!name || !address || !username || !passwordHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if username exists
  const existingCred = db.citizenCredentials.find(c => c.username === username.toLowerCase());
  if (existingCred) {
    const existingCitizen = db.citizens.find(c => c.id === existingCred.citizenId);
    if (existingCitizen) {
      return res.json({ id: existingCitizen.id });
    }
  }

  const id = db.nextCitizenId;
  db.nextCitizenId += 1;

  const newCitizen = { id, name, address };
  db.citizens.push(newCitizen);
  db.citizenCredentials.push({
    citizenId: id,
    username: username.toLowerCase(),
    passwordHash,
  });

  writeDB(db);
  res.json({ id });
});

// POST /api/citizens/login — login citizen
router.post('/login', (req, res) => {
  const db = readDB();
  const { username, passwordHash } = req.body;

  const cred = db.citizenCredentials.find(
    c => c.username === (username || '').toLowerCase() && c.passwordHash === passwordHash
  );
  if (!cred) return res.json(null);

  const citizen = db.citizens.find(c => c.id === cred.citizenId);
  res.json(citizen || null);
});

module.exports = router;
