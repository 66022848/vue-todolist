const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const User = require('../models/User');
const { getUserQuests } = require('../controllers/questController');
const { store } = require('../middlewares/sessionMiddleware');

// ฟังก์ชัน authenticateWithSessionId เพื่อยืนยัน session ID
function authenticateWithSessionId(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Received Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Session ')) {
    console.log('Unauthorized: No session ID or invalid format');
    return res.status(401).json({ message: 'Unauthorized: No session ID' });
  }

  const sessionId = authHeader.split(' ')[1];
  console.log('Extracted sessionId:', sessionId);

  store.get(sessionId, (err, session) => {
    if (err) {
      console.error('Redis/Store error:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    if (!session || !session.user) {
      console.log('Invalid or expired session for sessionId:', sessionId);
      return res.status(401).json({ message: 'Invalid session' });
    }

    console.log('Session found:', session);
    req.session = session;
    req.sessionID = sessionId;
    next();
  });
}

// Route สำหรับสร้าง Quest ใหม่
router.post('/', authenticateWithSessionId, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Please log in first' });
    }

    const { title, type, memoDetails, eventDetails } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (type === 'Memo' && (!memoDetails || !memoDetails.title || !memoDetails.selectedColor || !memoDetails.startDate || !memoDetails.startTime)) {
      return res.status(400).json({ message: 'Memo details are incomplete' });
    }

    const newQuest = new Quest({
      title,
      type,
      memoDetails: type === 'Memo' ? memoDetails : undefined,
      eventDetails: type === 'Event' ? eventDetails : undefined,
      userId: req.session.user.id,
    });

    await newQuest.save();

    const user = await User.findById(req.session.user.id);
    if (user) {
      user.points = (user.points || 0) + 10;
      await user.save();
      req.session.user.points = user.points;
      store.set(req.sessionID, req.session, (err) => {
        if (err) console.error('Error updating session:', err);
      });
    }

    res.status(201).json({
      message: 'Quest saved successfully',
      quest: newQuest,
      points: user.points
    });
  } catch (err) {
    console.error('Error saving quest:', err);
    res.status(500).json({ message: 'Error saving quest', error: err.message });
  }
});

// Route สำหรับดึง Quest ของผู้ใช้
router.get('/user', authenticateWithSessionId, getUserQuests);

// Route สำหรับดึงทั้งหมด
router.get('/', (req, res) => {
  Quest.find()
    .then((quests) => res.json(quests))
    .catch((err) => res.status(500).json({ message: 'Error fetching quests', error: err }));
});

module.exports = router;
