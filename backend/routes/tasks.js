const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

function authenticateSession(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Session ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const sessionId = authHeader.split(' ')[1];
  req.sessionID = sessionId;
  next();
}

router.get('/counts', authenticateSession, taskController.getTaskCounts);

module.exports = router;