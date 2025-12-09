const path = require('path');

module.exports = {
    DATA_DIR: path.join(__dirname, '../data'),
    FILES: {
        STOCKS: 'stocks.json',
        SUBSCRIPTIONS: 'subscriptions.json',
        NEWSLETTER: 'newsletter.json'
    },
    INITIAL_STOCKS: {
        "GOOG": 2845.32,
        "TSLA": 738.91,
        "AMZN": 3312.45,
        "META": 478.23,
        "NVDA": 895.67
    }
};
