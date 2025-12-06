const subscriptions = require('../data/subscriptions.json');

exports.getSubscriptions = (req, res) => {
    const { email } = req.query;
    const userSubs = subscriptions[email] || [];
    res.json({ subscriptions: userSubs });
};

exports.subscribe = (req, res) => {
    const { email, ticker } = req.body;
    if (!subscriptions[email]) {
        subscriptions[email] = [];
    }
    if (!subscriptions[email].includes(ticker)) {
        subscriptions[email].push(ticker);
    }
    res.json({ success: true, subscriptions: subscriptions[email] });
};

exports.unsubscribe = (req, res) => {
    const { email, ticker } = req.body;
    if (subscriptions[email]) {
        subscriptions[email] = subscriptions[email].filter(t => t !== ticker);
    }
    res.json({ success: true, subscriptions: subscriptions[email] });
};
