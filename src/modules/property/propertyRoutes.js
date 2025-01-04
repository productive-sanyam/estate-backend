const express = require('express');
const router = express.Router();
const propertyController = require('./propertyController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// POST /api/property
router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    propertyController.createProperty
);

// GET /api/property
router.get(
    '/',
    authMiddleware,
    propertyController.getProperties
);

// GET /api/property/:id
router.get(
    '/:id',
    authMiddleware,
    propertyController.getPropertyById
);

// PUT /api/property/:id
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    propertyController.updateProperty
);

// DELETE /api/property/:id
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    propertyController.deleteProperty
);

module.exports = router;