const JsonModel = require('../models/jsonModel');
const { FILES } = require('../config/constants');

const subscriptionModel = new JsonModel(FILES.SUBSCRIPTIONS, {});
const newsletterModel = new JsonModel(FILES.NEWSLETTER, []);

const getSubscriptions = (req, res) => {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User is required' });

    const allSubs = subscriptionModel.read();
    const userSubs = allSubs[user] || [];
    res.json(userSubs);
};

const updateSubscription = (req, res) => {
    const { user, ticker, action } = req.body;
    if (!user || !ticker || !action) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const allSubs = subscriptionModel.read();
    let userSubs = allSubs[user] || [];

    if (action === 'add') {
        if (!userSubs.includes(ticker)) userSubs.push(ticker);
    } else if (action === 'remove') {
        userSubs = userSubs.filter(t => t !== ticker);
    }

    allSubs[user] = userSubs;
    subscriptionModel.write(allSubs);

    res.json(userSubs);
};

const joinNewsletter = (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const subscribers = newsletterModel.read();
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        newsletterModel.write(subscribers);
    }

    res.json({ message: 'Subscribed successfully' });
};

module.exports = {
    getSubscriptions,
    updateSubscription,
    joinNewsletter
};
