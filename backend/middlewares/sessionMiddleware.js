const session = require('express-session');
const { RedisStore } = require('connect-redis');
const Redis = require('ioredis');
require('dotenv').config();

let store;
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  const redisClient = new Redis(process.env.REDIS_URL);

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  store = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
  });
} else {
  store = new session.MemoryStore();
  console.warn('Using MemoryStore - not suitable for production unless temporary');
}

module.exports = session({
  store: store,
  secret: process.env.SESSION_SECRET || 'your-default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // ใช้ secure ใน production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 วัน
    sameSite: 'lax', // ใช้ lax เพื่อให้ cookie ส่งใน cross-site requests ได้
  },
});