const stocks = require('../data/stocks.json');

/**
 * Updates stock prices randomly between -0.6% and +0.6%
 * @returns {Object} The updated stocks object
 */
function updatePrices() {
    for (let s in stocks) {
        // Random percentage between -0.6 and +0.6
        let percentage = (Math.random() * 1.2 - 0.6) / 100;
        let delta = stocks[s] * percentage;
        stocks[s] += delta;
        // Round to 2 decimal places for cleanliness, though float precision is fine
        stocks[s] = Math.round(stocks[s] * 100) / 100;
    }
    return stocks;
}

function getStocks() {
    return stocks;
}

module.exports = {
    updatePrices,
    getStocks
};
