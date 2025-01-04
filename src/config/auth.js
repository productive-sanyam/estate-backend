// config/auth.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            roles: user.roles
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
};
