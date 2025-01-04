// controllers/userController.js
const userService = require('../services/userService');

/**
 * Admin-only endpoint to create a user (and possibly userExtn).
 * We set createdBy to the current user’s ID.
 */
const createUser = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            createdBy: req.user.userId,
            updatedBy: req.user.userId
        };
        const user = await userService.createUserAndExtn(payload);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * GET /api/users - paginated, filtered
 */
const getUsers = async (req, res) => {
    try {
        const result = await userService.listUsers(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * GET /api/users/:id - always returns user + extn
 */
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Update user + concurrency
 */
const updateUser = async (req, res) => {
    try {
        // Ensure we set updatedBy
        const payload = {
            ...req.body,
            updatedBy: req.user.userId
        };
        const updatedUser = await userService.updateUser(req.params.id, payload);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Delete user + extn
 */
const deleteUser = async (req, res) => {
    try {
        const deleted = await userService.deleteUser(req.params.id);
        return res.status(200).json(deleted);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
