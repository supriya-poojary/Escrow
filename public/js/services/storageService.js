// Storage Service - localStorage wrapper for user subscriptions
// Replaces server-side file storage

class StorageService {
    constructor() {
        this.STORAGE_KEY = 'aether_subscriptions';
    }

    /**
     * Get all subscriptions from localStorage
     * @returns {Object} All user subscriptions { email: [tickers] }
     */
    getAllSubscriptions() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error reading subscriptions:', error);
            return {};
        }
    }

    /**
     * Get subscriptions for specific user
     * @param {string} email - User email
     * @returns {Array} Array of ticker symbols
     */
    getSubscriptions(email) {
        if (!email) return [];
        const allSubs = this.getAllSubscriptions();
        return allSubs[email] || [];
    }

    /**
     * Save subscriptions for specific user
     * @param {string} email - User email
     * @param {Array} tickers - Array of ticker symbols
     */
    saveSubscriptions(email, tickers) {
        if (!email) return;

        const allSubs = this.getAllSubscriptions();
        allSubs[email] = tickers;

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allSubs));
        } catch (error) {
            console.error('Error saving subscriptions:', error);
        }
    }

    /**
     * Add subscription for user
     * @param {string} email - User email
     * @param {string} ticker - Stock ticker to add
     * @returns {Array} Updated subscriptions
     */
    addSubscription(email, ticker) {
        if (!email || !ticker) return [];

        const subs = this.getSubscriptions(email);
        if (!subs.includes(ticker)) {
            subs.push(ticker);
            this.saveSubscriptions(email, subs);
        }
        return subs;
    }

    /**
     * Remove subscription for user
     * @param {string} email - User email
     * @param {string} ticker - Stock ticker to remove
     * @returns {Array} Updated subscriptions
     */
    removeSubscription(email, ticker) {
        if (!email || !ticker) return [];

        const subs = this.getSubscriptions(email);
        const filtered = subs.filter(t => t !== ticker);
        this.saveSubscriptions(email, filtered);
        return filtered;
    }

    /**
     * Clear all subscriptions for user
     * @param {string} email - User email
     */
    clearSubscriptions(email) {
        if (!email) return;
        this.saveSubscriptions(email, []);
    }

    /**
     * Initialize default subscriptions for new user
     * @param {string} email - User email
     * @param {Array} defaultTickers - Default tickers to subscribe
     */
    initializeDefaults(email, defaultTickers = ['GOOG', 'TSLA', 'AMZN']) {
        const existing = this.getSubscriptions(email);
        if (existing.length === 0) {
            this.saveSubscriptions(email, defaultTickers);
        }
    }
}

// Create singleton instance
const storageService = new StorageService();
window.storageService = storageService; // Expose globally

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = storageService;
}
