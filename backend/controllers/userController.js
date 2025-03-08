const User = require('../models/User');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.getUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'ไม่มีการล็อกอิน' });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    // ไม่ต้องใช้ req.session.touch ถ้าไม่จำเป็น
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user from DB:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้', error: error.message });
  }
};

exports.updateUser = [
  upload.single('picture'),
  async (req, res) => {
    try {
      if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'Unauthorized: Please log in first' });
      }

      const userId = req.session.user.id;
      const { username } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (username) {
        user.username = username;
      }

      if (req.file) {
        user.picture = `https://vue-todolist-backend.onrender.com/uploads/${req.file.filename}`;
      }

      await user.save();

      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          picture: user.picture,
          points: user.points
        },
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  }
];