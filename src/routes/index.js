const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const propertyRoutes = require('./propertyRoutes');

router.get('/', (req, res) => {
    res.send('API is running...');
});

router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/properties', propertyRoutes);

module.exports = router;
