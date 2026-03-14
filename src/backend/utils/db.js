const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '../db.json');

const EMPTY_DB = {
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
  nextRequestId: 1
};

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    // Ensure all required arrays exist
    return {
      users: data.users ?? [],
      citizens: data.citizens ?? [],
      learningRequests: data.learningRequests ?? [],
      certificationResults: data.certificationResults ?? [],
      practicalVideoSubmissions: data.practicalVideoSubmissions ?? [],
      videoStore: data.videoStore ?? [],
      workerCredentials: data.workerCredentials ?? [],
      citizenCredentials: data.citizenCredentials ?? [],
      nextUserId: data.nextUserId ?? 1,
      nextCitizenId: data.nextCitizenId ?? 1,
      nextRequestId: data.nextRequestId ?? 1,
    };
  } catch {
    return { ...EMPTY_DB };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readDB, writeDB };
