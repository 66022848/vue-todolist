const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route สำหรับการลงทะเบียน (Register)
router.post('/register', registerUser);

// Route สำหรับการเข้าสู่ระบบ (Login)
router.post('/login', loginUser);

module.exports = router;
