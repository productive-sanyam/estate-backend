// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./authController');

// Only a login route is provided (no self-registration)
router.post('/login', authController.login);

module.exports = router;
