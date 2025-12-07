const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const priceService = require('./services/priceService');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', apiRoutes);

const SUBS_FILE = path.join(__dirname, 'data/subscriptions.json');

function getSubscriptions() {
    if (fs.existsSync(SUBS_FILE)) {
        return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
    }
    return {};
}

// WebSocket Handling
wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const email = urlParams.get('email');

    if (email) {
        ws.email = email;
        console.log(`[WS] Client connected: ${email}`);

        // Send initial state
        const allPrices = priceService.getStocks();
        const allSubs = getSubscriptions();
        const userSubs = allSubs[email] || [];

        const initialData = {};
        userSubs.forEach(t => {
            if (allPrices[t] !== undefined) initialData[t] = allPrices[t];
        });

        ws.send(JSON.stringify({ type: 'WELCOME', data: initialData }));
    } else {
        console.log('[WS] Anonymous connection refused updates');
    }

    ws.on('close', () => console.log(`[WS] Client disconnected: ${ws.email}`));
});

// Broadcast Loop
setInterval(() => {
    const newPrices = priceService.updatePrices();
    const allSubs = getSubscriptions(); // Re-read latest subscriptions

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.email) {
            const userSubs = allSubs[client.email] || [];
            const updatePayload = {};
            let hasUpdate = false;

            userSubs.forEach(ticker => {
                if (newPrices[ticker] !== undefined) {
                    updatePayload[ticker] = newPrices[ticker];
                    hasUpdate = true;
                }
            });

            if (hasUpdate) {
                client.send(JSON.stringify({
                    type: 'UPDATE',
                    data: updatePayload,
                    timestamp: Date.now()
                }));
            }
        }
    });
}, 1000);

// ✅ Serve index.html for all unknown routes (frontend compatibility)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ✅ Dynamic PORT for Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
