const session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
});

const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET || 'your-default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // ใช้ secure mode ใน production เท่านั้น
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ปรับ sameSite ให้เข้ากับ env
  },
});

module.exports = sessionMiddleware;
