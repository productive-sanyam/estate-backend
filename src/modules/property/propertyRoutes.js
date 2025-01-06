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


/**
 * POST /api/property/stats
 * 
 * This endpoint allows property dealers and researchers to generate various statistics based on properties.
 * 
 * **Request Body:**
 * ```json
 * {
 *   "unwind": "tags", // Optional: Field to unwind if dealing with arrays
 *   "groupBy": {
 *     "location": "location.city",
 *     "status": "status"
 *   },
 *   "sum": "price",
 *   "avg": "size",
 *   "inFilters": {
 *     "status": ["available", "rented"]
 *   },
 *   "notInFilters": {
 *     "tags": ["luxury"]
 *   },
 *   "btwFilters": {
 *     "price": [100000, 500000]
 *   },
 *   "existsFilter": {
 *     "images": true
 *   },
 *   "filters": {
 *     "bedrooms": 3
 *   },
 *   "ltFilters": {
 *     "size": 2000
 *   },
 *   "gtFilters": {
 *     "views": 100
 *   },
 *   "caseIgnoreFilters": {
 *     "title": "Villa"
 *   },
 *   "page": 1,
 *   "rows": 10,
 *   "sortBy": "total",
 *   "sortAsc": "false"
 * }
 * ```
 * 
 * **Description:**
 * - **unwind**: Unwinds the specified array field.
 * - **groupBy**: Groups the results by the specified fields.
 * - **sum**: Sums up the specified field.
 * - **avg**: Calculates the average of the specified field.
 * - **inFilters**: Filters where the field's value is in the specified array.
 * - **notInFilters**: Filters where the field's value is not in the specified array.
 * - **btwFilters**: Filters where the field's value is between the specified min and max.
 * - **existsFilter**: Filters based on the existence of the field.
 * - **filters**: Simple equality filters.
 * - **ltFilters**: Filters where the field's value is less than the specified value.
 * - **gtFilters**: Filters where the field's value is greater than the specified value.
 * - **caseIgnoreFilters**: Case-insensitive exact match filters.
 * - **page**: Pagination - page number.
 * - **rows**: Pagination - number of rows per page. Use `-1` for no limit.
 * - **sortBy**: Field to sort by.
 * - **sortAsc**: `"true"` for ascending, `"false"` for descending.
 * 
 * **Response:**
 * ```json
 * [
 *   {
 *     "_id": {
 *       "location": "New York",
 *       "status": "available"
 *     },
 *     "total": 500000,
 *     "average": 1500
 *   },
 *   ...
 * ]
 * ```
 */
router.post(
    '/stats',
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    propertyController.getPropertyStats
);



module.exports = router;