const express = require('express');
const cors = require('cors');
const { sessionMiddleware } = require('./middlewares/sessionMiddleware');
const passport = require('./config/passport');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://66022848.github.io',
    'https://66022848.github.io/vue-todolist'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to vue-todolist-backend API! Use /api/... for endpoints.' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/quest', require('./routes/quest'));
app.use('/api/tasks', require('./routes/tasks'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running on port ${port}`));