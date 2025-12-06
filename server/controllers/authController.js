const users = require('../data/users.json');

exports.login = (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'User not found' });
    }
};
