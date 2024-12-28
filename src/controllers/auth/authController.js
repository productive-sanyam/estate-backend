const User = require('../../models/User/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).populate('role', 'name rights');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role.name,
                rights: user.role.rights,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token validity (1 day)
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error: error.message });
    }
};

module.exports = { loginUser };
