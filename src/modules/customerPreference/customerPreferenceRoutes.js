// modules/customerPreference/customerPreferenceRoutes.js
const express = require('express');
const router = express.Router();
const customerPreferenceController = require('./customerPreferenceController');

// If you require only authorized staff (or the customer themself) to create / update preferences:
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');
// Or a specialized "customerAuthMiddleware" if the customer is updating their own preference:
const customerAuthMiddleware = require('../../middlewares/customerAuthMiddleware');

/**
 * CREATE a new preference document
 *    - Possibly open if it's part of lead generation
 *    - Or protect it with 'customerAuthMiddleware' if the customer must be logged in
 */
router.post('/',
    // e.g., no middleware => public can fill out preferences
    // or "customerAuthMiddleware" => only a logged-in customer can create
    customerPreferenceController.createPreference
);

/**
 * GET preference by Customer ID
 *    - Typically protected route. 
 */
router.get('/by-customer/:customerId',
    // Decide if only the agent or the same customer can view
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    customerPreferenceController.getPreferenceByCustomerId
);

/**
 * UPDATE preference by doc ID
 *    - Could allow admin/manager or the actual customer.
 */
router.put('/:id',
    // e.g., authMiddleware,
    // roleMiddleware(['ADMIN', 'MANAGER']),
    customerPreferenceController.updatePreference
);

/**
 * DELETE preference by doc ID
 */
router.delete('/:id',
    // e.g., authMiddleware,
    // roleMiddleware(['ADMIN']),
    customerPreferenceController.deletePreference
);

/**
 * OPTIONAL: GET properties matching a certain customer's preference
 */
router.get('/:customerId/matching-properties',
    // Could require agent or manager role
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    customerPreferenceController.getPropertiesMatchingCustomerPreference
);

module.exports = router;
