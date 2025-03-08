const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');

exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleCallback = [
  passport.authenticate('google', {
    failureRedirect: 'https://66022848.github.io/vue-todolist/login',
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

      await req.session.save();
      console.log('Session data after Google Login:', req.session.user);
      res.redirect('https://66022848.github.io/vue-todolist/dashboard/home');
    } catch (error) {
      console.error('Google Callback Error:', error.message, error.stack);
      res.redirect('https://66022848.github.io/vue-todolist/login?error=auth_failed');
    }
  }
];

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      picture: user.picture,
    };

    console.log('Session data after Email Login:', req.session.user);
    res.json({ user: req.session.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
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

    res.status(201).json({ message: 'User registered successfully', user: req.session.user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};