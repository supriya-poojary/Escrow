const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const SUBS_FILE = path.join(__dirname, '../data/subscriptions.json');

// Helper to read/write JSON
function readJson(file) {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// POST /login
router.post('/login', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    // In a real app we'd check password. Here we just return a "token"
    res.json({
        token: Buffer.from(email).toString('base64'),
        email: email,
        message: 'Login successful'
    });
});

// GET /subscriptions
router.get('/subscriptions', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const subs = readJson(SUBS_FILE);
    res.json({ subscriptions: subs[email] || [] });
});

// POST /subscribe
router.post('/subscribe', (req, res) => {
    const { email, ticker } = req.body;
    if (!email || !ticker) return res.status(400).json({ error: 'Email and ticker required' });

    const subs = readJson(SUBS_FILE);
    if (!subs[email]) subs[email] = [];

    if (!subs[email].includes(ticker)) {
        subs[email].push(ticker);
        writeJson(SUBS_FILE, subs);
    }

    res.json({ subscriptions: subs[email] });
});

// POST /unsubscribe
router.post('/unsubscribe', (req, res) => {
    const { email, ticker } = req.body;
    if (!email || !ticker) return res.status(400).json({ error: 'Email and ticker required' });

    const subs = readJson(SUBS_FILE);
    if (subs[email]) {
        subs[email] = subs[email].filter(t => t !== ticker);
        writeJson(SUBS_FILE, subs);
    }

    res.json({ subscriptions: subs[email] || [] });
});

module.exports = router;
