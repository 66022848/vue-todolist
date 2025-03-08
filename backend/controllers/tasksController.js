const Quest = require('../models/Quest');

exports.getTaskCounts = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Please log in first' });
    }

    const counts = await Quest.aggregate([
      { $match: { userId: req.session.user.id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      upcomingCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      summary: {
        labels: ['Event', 'Memo'],
        data: [0, 0]
      }
    };

    counts.forEach(item => {
      if (item._id === 'Event') result.summary.data[0] = item.count;
      if (item._id === 'Memo') result.summary.data[1] = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching task counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};