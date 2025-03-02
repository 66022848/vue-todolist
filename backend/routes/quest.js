const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const User = require('../models/User');
const { getUserQuests } = require('../controllers/questController');

router.post('/', async (req, res) => {
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

router.get('/user', getUserQuests);

router.get('/', (req, res) => {
  Quest.find()
    .then((quests) => res.json(quests))
    .catch((err) => res.status(500).json({ message: 'Error fetching quests', error: err }));
});

module.exports = router;