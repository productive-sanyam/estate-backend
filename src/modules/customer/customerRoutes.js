// modules/customer/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('./customerController');

// If you want only internal staff (users with certain roles) to manage these leads:
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// Create a new Customer (public or restricted?)
router.post('/', customerController.createCustomer);

// You can decide if you want to protect the next routes:
router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), customerController.getCustomers);
router.get('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), customerController.getCustomerById);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), customerController.updateCustomer);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), customerController.deleteCustomer);

module.exports = router;
