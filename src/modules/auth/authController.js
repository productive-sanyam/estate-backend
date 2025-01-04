const userService = require('../user/userService');
const { generateToken } = require('../../config/auth');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.login(email, password);

        const token = generateToken(user);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    login
};
