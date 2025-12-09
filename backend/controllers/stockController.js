const JsonModel = require('../models/jsonModel');
const { FILES, INITIAL_STOCKS } = require('../config/constants');

const stockModel = new JsonModel(FILES.STOCKS, INITIAL_STOCKS);

// Helper to simulate random walk
const simulateVariation = (currentPrices) => {
    const newPrices = { ...currentPrices };
    for (let ticker in newPrices) {
        // Random percentage between -0.6% and +0.6%
        const percentage = (Math.random() * 1.2 - 0.6) / 100;
        const delta = newPrices[ticker] * percentage;
        newPrices[ticker] += delta;
        // Round to 2 decimal places
        newPrices[ticker] = Math.round(newPrices[ticker] * 100) / 100;
    }
    return newPrices;
};

// Store history in memory for this session (or could accept persist to file if needed)
// For now, we'll keep history simple in memory to avoid huge JSON files
const history = {};
Object.keys(INITIAL_STOCKS).forEach(ticker => history[ticker] = []);

const getStocks = (req, res) => {
    let currentPrices = stockModel.read();

    // Simulate variation on every read to ensure dynamic data
    const newPrices = simulateVariation(currentPrices);
    stockModel.write(newPrices);

    // Update history
    Object.keys(newPrices).forEach(ticker => {
        if (!history[ticker]) history[ticker] = [];
        history[ticker].push(newPrices[ticker]);
        if (history[ticker].length > 50) history[ticker].shift(); // Keep last 50 points
    });

    res.json(newPrices);
};

const getStockHistory = (req, res) => {
    const { ticker } = req.params;
    if (ticker && history[ticker]) {
        res.json(history[ticker]);
    } else if (ticker) {
        res.status(404).json({ error: 'Ticker not found' });
    } else {
        res.json(history);
    }
};

module.exports = {
    getStocks,
    getStockHistory
};
