const express = require('express');
const { createRole, updateRole, getRole, deleteRole } = require('../controllers/role/roleController');

const router = express.Router();

router.post('/', createRole);
router.put('/:id', updateRole);
router.get('/:id', getRole);
router.delete('/:id', deleteRole);

module.exports = router;
