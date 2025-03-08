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
      if (!req.user) {
        throw new Error('No user data after authentication');
      }

      req.session.user = {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        picture: req.user.picture,
      };

      await req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          throw err;
        }
        console.log('Session saved successfully, sessionID:', req.sessionID);
      });

      res.json({
        user: req.session.user,
        sessionId: req.sessionID
      });
    } catch (error) {
      console.error('Google Callback Error:', error.message, error.stack);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }
];

exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, password: req.body.password });
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    req.session.userId = user._id;
    console.log('Session saved successfully, sessionID:', req.session.id);

    // บันทึก session ลง Redis (ถ้าใช้)
    if (req.sessionStore && typeof req.sessionStore.set === 'function') {
      await new Promise((resolve, reject) => {
        req.sessionStore.set(req.session.id, req.session, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    res.json({ sessionId: req.session.id, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
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

    req.session.user = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };

    await req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        throw err;
      }
      console.log('Session saved successfully, sessionID:', req.sessionID);
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: req.session.user,
      sessionId: req.sessionID
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Session ')) {
    return res.status(401).json({ message: 'Unauthorized: No session ID' });
  }
  const sessionId = authHeader.split(' ')[1];

  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};