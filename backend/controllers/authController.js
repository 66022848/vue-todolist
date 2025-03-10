const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');

exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleCallback = [
  passport.authenticate('google', {
    failureRedirect: 'https://66022848.github.io/vue-todolist/login',
    session: false,
  }),
  async (req, res) => {
    try {
      if (!req.user) throw new Error('No user data after authentication');

      let user = await User.findOne({ email: req.user.email });
      if (!user) {
        user = new User({
          email: req.user.email,
          username: req.user.displayName,
          picture: req.user.picture,
        });
        await user.save();
      }

      req.session.userId = user._id;
      await new Promise((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
      });

      console.log('Session saved successfully:', req.session.id);
      res.json({ success: true, message: 'Login successful' });
    } catch (error) {
      console.error('Google Callback Error:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  },
];

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    await new Promise((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()));
    });

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    req.session.userId = newUser._id; // ใช้ userId เพื่อสอดคล้องกับ getUser
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Session saved successfully, sessionID:', req.session.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, email: newUser.email, username: newUser.username },
      sessionId: req.session.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.logout = (req, res) => {
  if (!req.sessionID) {
    return res.status(400).json({ message: 'No active session' });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};