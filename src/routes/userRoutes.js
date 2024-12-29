// File: routes/userRoutes.js

const express = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers//user/userController');

const router = express.Router();

// Create a new user
router.post('/', createUser);

// Get all users (supports pagination & filter)
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/:id', updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

module.exports = router;
