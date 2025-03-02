const axios = require('axios');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

exports.googleLogin = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=profile email`;
  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Code not received' });
  }

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;

    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = new User({
        email: profile.email,
        username: profile.name || 'Google User',
        password: '',
        picture: profile.picture,
      });
      await user.save();
    } else {

      user.picture = profile.picture;
      await user.save();
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      picture: user.picture,
    };

    console.log('Session data after Google Login:', req.session.user);

    res.redirect('http://localhost:5173/vue-todolist/dashboard/home');
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

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