const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);
router.get('/', (req, res) => res.status(200).json({ message: 'API is working' }));
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;