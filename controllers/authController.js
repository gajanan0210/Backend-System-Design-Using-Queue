// controllers/authController.js
const jwt = require('jwt-simple');
const User = require('../models/User');
const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered');
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).send('Invalid username or password');
    }
    const token = jwt.encode({ id: user.id }, secret);
    res.send({ token });
};
