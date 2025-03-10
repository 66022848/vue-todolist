const Quest = require('../models/Quest');

const getUserQuests = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Please log in first' });
    }

    const quests = await Quest.find({ userId: req.session.user.id })
      .sort({ lastModified: -1 })
      .exec();

    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

    const todayQuests = quests.filter(quest => {
      const questDate = new Date(quest.lastModified || quest.createdAt);
      return questDate.toDateString() === new Date().toDateString();
    });

    const past7DaysQuests = quests.filter(quest => {
      const questDate = new Date(quest.lastModified || quest.createdAt);
      return questDate > sevenDaysAgo && questDate.toDateString() !== new Date().toDateString();
    });

    res.json({
      todayQuests,
      past7DaysQuests,
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ส่งออกฟังก์ชัน getUserQuests
module.exports = { getUserQuests };
