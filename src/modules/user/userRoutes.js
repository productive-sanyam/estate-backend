const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('./../../middlewares/authMiddleware');
const roleMiddleware = require('./../../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPERADMIN']), userController.createUser);

router.get('/', authMiddleware, userController.getUsers);

router.get('/:id', authMiddleware, userController.getUserById);

router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPERADMIN']), userController.updateUser);

router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPERADMIN']), userController.deleteUser);

module.exports = router;
