// middlewares/customerAuthMiddleware.js
const { verifyToken } = require('../config/auth');
const Customer = require('../modules/customer/Customer');

const customerAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = verifyToken(token);
        // For example, decode => { customerId: "..." }
        const customer = await Customer.findById(decoded.customerId);
        if (!customer) {
            return res.status(401).json({ error: 'Invalid token / customer not found' });
        }
        req.customer = { id: customer._id }; // attach customer info
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = customerAuthMiddleware;
