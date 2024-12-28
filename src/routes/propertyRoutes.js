const express = require('express');
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
} = require('../controllers/property/propertyController');

const router = express.Router();

// Create a new property
router.post('/', createProperty);

// Get all properties with filters
router.get('/', getProperties);

// Get a single property by ID
router.get('/:id', getPropertyById);

// Update a property
router.put('/:id', updateProperty);

// Delete a property
router.delete('/:id', deleteProperty);

module.exports = router;
