const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNo, address, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if role exists
        const roleObj = await Role.findById(role);
        if (!roleObj) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Create the user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            address,
            role,
        });

        const savedUser = await user.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name rights'); // Populate role details
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role', 'name rights');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNo, address, role } = req.body;

        // Check if role exists
        if (role) {
            const roleObj = await Role.findById(role);
            if (!roleObj) {
                return res.status(400).json({ message: 'Invalid role' });
            }
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNo = phoneNo || user.phoneNo;
        user.address = address || user.address;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
