// middleware/authMiddleware.js
const jwt = require('jwt-simple');
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Unauthorized');
    try {
        const decoded = jwt.decode(token, secret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send('Unauthorized');
    }
};
