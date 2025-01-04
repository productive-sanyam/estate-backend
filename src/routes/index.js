// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./../modules/auth/authRoutes');
const userRoutes = require('./../modules/user/userRoutes'); 
const roleRoutes = require('./../modules/role/roleRoutes');

router.get('/', (req, res) => {
    res.send('API is running...');
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
