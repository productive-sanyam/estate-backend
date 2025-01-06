// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./../modules/auth/authRoutes');
const userRoutes = require('./../modules/user/userRoutes'); 
const roleRoutes = require('./../modules/role/roleRoutes');
const propertyRoutes = require('./../modules/property/propertyRoutes');

router.get('/', (req, res) => {
    res.send('API is running...');
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/property', propertyRoutes);

module.exports = router;
