const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');

const router = express.Router();
router.get('/', getUser);
router.put('/update', updateUser);

module.exports = router;