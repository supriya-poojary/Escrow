const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const userController = require('../controllers/userController');

// Stock Routes
router.get('/stocks', stockController.getStocks); // Get all current prices
router.get('/stocks/history', stockController.getStockHistory); // Get history for all stocks
router.get('/stocks/history/:ticker', stockController.getStockHistory); // Get history for specific stock

// User/Subscription Routes
router.get('/subscriptions', userController.getSubscriptions); // Get user subscriptions
router.post('/subscriptions', userController.updateSubscription); // Add/Remove subscription
router.post('/newsletter', userController.joinNewsletter); // Subscribe to newsletter

module.exports = router;
