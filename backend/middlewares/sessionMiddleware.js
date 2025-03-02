const session = require('express-session');
const { RedisStore } = require('connect-redis');
const Redis = require('ioredis');
require('dotenv').config();

let store;
if (process.env.NODE_ENV === 'production') {
  const redisClient = new Redis(process.env.REDIS_URL || {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  store = new RedisStore({
    client: redisClient,
    prefix: 'sess:'
  });
} else {
  store = new session.MemoryStore();
  console.warn('Using MemoryStore for local development - not suitable for production');
}

module.exports = session({
  store: store,
  secret: process.env.SESSION_SECRET || 'your-default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  }
});