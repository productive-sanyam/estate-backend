const express = require('express');
const router = express.Router();
const propertyController = require('./propertyController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const customerAuthMiddleware = require('../../middlewares/customerAuthMiddleware');

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

/**
 * GET /api/property/customer-visible
 *   This endpoint is specifically for the "customer" perspective 
 *   to retrieve properties assigned to them or visible to all.
 *   Typically, they'd be a "customer" token or you'd store in a separate route altogether, e.g. /customer/properties
 */
router.get(
    '/customer-visible',
    customerAuthMiddleware,
    // a specialized "customerAuthMiddleware" if you have a separate way of verifying customers
    propertyController.getPropertiesForCustomer
);


module.exports = router;