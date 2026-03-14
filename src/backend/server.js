const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' })); // large for base64 video

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/citizens', require('./routes/citizens'));
app.use('/api/learning-requests', require('./routes/learning'));
app.use('/api/certification', require('./routes/certification'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`KNOT backend running on port ${PORT}`));
