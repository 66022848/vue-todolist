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
  if (!req.session.user || !req.session.user.id) {
    console.log('No session user found');
    return res.json({ user: null });
  }

  try {
    const user = await User.findById(req.session.user.id).select('-password');
    if (!user) {
      console.log('User not found in DB');
      return res.json({ user: null });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        picture: user.picture,
        points: user.points
      },
    });
  } catch (error) {
    console.error('Error fetching user from DB:', error);
    res.json({ user: null });
  }
};

exports.updateUser = [
  upload.single('picture'),
  async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.id) {
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