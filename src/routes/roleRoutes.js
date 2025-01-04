// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Suppose only 'SUPERADMIN' can manage roles
router.post('/', authMiddleware, roleMiddleware(['SUPERADMIN']), roleController.createRole);
router.get('/', authMiddleware, roleMiddleware(['SUPERADMIN']), roleController.getRoles);
router.get('/:id', authMiddleware, roleMiddleware(['SUPERADMIN']), roleController.getRoleById);
router.put('/:id', authMiddleware, roleMiddleware(['SUPERADMIN']), roleController.updateRole);
router.delete('/:id', authMiddleware, roleMiddleware(['SUPERADMIN']), roleController.deleteRole);

module.exports = router;
