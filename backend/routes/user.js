const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const { store } = require('../middlewares/sessionMiddleware');

const router = express.Router();

function authenticateWithSessionId(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Session ')) {
    return res.status(401).json({ message: 'Unauthorized: No session ID' });
  }
  const sessionId = authHeader.split(' ')[1];

  store.get(sessionId, (err, session) => {
    if (err) {
      console.error('Redis error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!session || !session.user) {
      console.log('Invalid or expired session:', sessionId);
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.session = session;
    req.sessionID = sessionId;
    next();
  });
}

router.get('/', authenticateWithSessionId, getUser);
router.put('/update', authenticateWithSessionId, updateUser);

module.exports = router;