// Mock Price Service - Simulates real-time stock price updates
// Replaces server/services/priceService.js

class MockPriceService {
    constructor() {
        // Initial stock prices
        this.stocks = {
            "GOOG": 2845.32,
            "TSLA": 738.91,
            "AMZN": 3312.45,
            "META": 478.23,
            "NVDA": 895.67
        };

        this.subscribers = [];
        this.updateInterval = null;
    }

    /**
     * Start price updates
     * @param {number} intervalMs - Update interval in milliseconds (default 2500)
     */
    start(intervalMs = 2500) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updatePrices();
            this.notifySubscribers();
        }, intervalMs);
    }

    /**
     * Stop price updates
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Update all stock prices with random fluctuations
     * Simulates market volatility between -0.6% and +0.6%
     */
    updatePrices() {
        for (let ticker in this.stocks) {
            // Random percentage between -0.6 and +0.6
            const percentage = (Math.random() * 1.2 - 0.6) / 100;
            const delta = this.stocks[ticker] * percentage;
            this.stocks[ticker] += delta;
            // Round to 2 decimal places
            this.stocks[ticker] = Math.round(this.stocks[ticker] * 100) / 100;
        }
    }

    /**
     * Get current stock prices
     * @returns {Object} Current stock prices
     */
    getStocks() {
        return { ...this.stocks };
    }

    /**
     * Get price for specific ticker
     * @param {string} ticker - Stock ticker symbol
     * @returns {number} Current price
     */
    getPrice(ticker) {
        return this.stocks[ticker];
    }

    /**
     * Subscribe to price updates
     * @param {Function} callback - Function to call on price update
     */
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    /**
     * Unsubscribe from price updates
     * @param {Function} callback - Callback to remove
     */
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }

    /**
     * Notify all subscribers of price changes
     */
    notifySubscribers() {
        const prices = this.getStocks();
        this.subscribers.forEach(callback => {
            callback(prices);
        });
    }
}

// Create singleton instance
const mockPriceService = new MockPriceService();
window.mockPriceService = mockPriceService; // Expose globally

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockPriceService;
}
