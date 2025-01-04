// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Only users with role 'ADMIN' or 'SUPERADMIN' can create new users
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPERADMIN']), userController.createUser);

// Everyone with a valid token can see user listing
router.get('/', authMiddleware, userController.getUsers);

// Single user detail => returns user + extn
router.get('/:id', authMiddleware, userController.getUserById);

// Update => require concurrency (version) & role
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPERADMIN']), userController.updateUser);

// Delete => admin or superadmin
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPERADMIN']), userController.deleteUser);

module.exports = router;
