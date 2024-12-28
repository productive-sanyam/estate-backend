const express = require('express');
const { loginUser } = require('../controllers/auth/authController');

const router = express.Router();

// Login Route
router.post('/login', loginUser);

module.exports = router;
