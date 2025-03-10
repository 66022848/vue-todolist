const Quest = require('../models/Quest');

exports.getQuests = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const quests = await Quest.find({ userId: req.session.userId });
    res.json(quests);
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
