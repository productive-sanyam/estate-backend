// routes/userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const { combinedUserSchema } = require('./userValidation');
const validateRequest = require('../../middlewares/validateMiddleware');

// POST /api/user
router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN', 'SUPERADMIN']),
    userController.createUser
);

// GET USERS
router.get(
    '/',
    authMiddleware,
    userController.getUsers
);

// GET USER BY ID
router.get(
    '/:id',
    authMiddleware,
    userController.getUserById
);

// UPDATE USER
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'SUPERADMIN']),
    userController.updateUser
);

// DELETE USER
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'SUPERADMIN']),
    userController.deleteUser
);

// DELETE ALL USERS
router.delete(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN', 'SUPERADMIN']),
    userController.deleteAllUsers
);

module.exports = router;
