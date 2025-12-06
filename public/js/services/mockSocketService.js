// Mock WebSocket Service - Simulates WebSocket connection
// Replaces real WebSocket connection to backend server

class MockSocketService {
    constructor(email) {
        this.email = email;
        this.connected = false;
        this.messageHandler = null;
        this.priceUpdateCallback = null;
    }

    /**
     * Connect to mock WebSocket (simulated)
     * @param {Function} onMessage - Callback for incoming messages
     */
    connect(onMessage) {
        this.messageHandler = onMessage;

        // Simulate connection delay
        setTimeout(() => {
            this.connected = true;
            console.log(`[MockWS] Connected as ${this.email}`);

            // Send initial WELCOME message with all stock prices
            this.sendWelcomeMessage();

            // Start listening to price updates
            this.startPriceUpdates();
        }, 100);
    }

    /**
     * Send initial WELCOME message with current prices
     */
    sendWelcomeMessage() {
        if (!this.messageHandler) return;

        // Get user's subscriptions from localStorage
        const userSubs = window.storageService.getSubscriptions(this.email);

        // Get current prices for subscribed stocks
        const allPrices = window.mockPriceService.getStocks();
        const initialData = {};

        userSubs.forEach(ticker => {
            if (allPrices[ticker] !== undefined) {
                initialData[ticker] = allPrices[ticker];
            }
        });

        // Send WELCOME message
        this.messageHandler({
            type: 'WELCOME',
            data: initialData
        });
    }

    /**
     * Start listening to price updates from mockPriceService
     */
    startPriceUpdates() {
        // Subscribe to price service updates
        this.priceUpdateCallback = (allPrices) => {
            if (!this.messageHandler) return;

            // Get user's current subscriptions
            const userSubs = window.storageService.getSubscriptions(this.email);

            // Filter prices for subscribed stocks only
            const updateData = {};
            userSubs.forEach(ticker => {
                if (allPrices[ticker] !== undefined) {
                    updateData[ticker] = allPrices[ticker];
                }
            });

            // Send UPDATE message
            if (Object.keys(updateData).length > 0) {
                this.messageHandler({
                    type: 'UPDATE',
                    data: updateData
                });
            }
        };

        window.mockPriceService.subscribe(this.priceUpdateCallback);
    }

    /**
     * Disconnect from mock WebSocket
     */
    disconnect() {
        this.connected = false;

        // Unsubscribe from price updates
        if (this.priceUpdateCallback) {
            window.mockPriceService.unsubscribe(this.priceUpdateCallback);
            this.priceUpdateCallback = null;
        }

        console.log(`[MockWS] Disconnected`);
    }

    /**
     * Send message (simulated - not used in current implementation)
     * @param {Object} message - Message to send
     */
    send(message) {
        console.log('[MockWS] Send:', message);
    }

    /**
     * Check if connected
     * @returns {boolean} Connection status
     */
    isConnected() {
        return this.connected;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockSocketService;
}
window.MockSocketService = MockSocketService; // Expose globally
