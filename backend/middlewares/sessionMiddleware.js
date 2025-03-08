const session = require('express-session');
const { RedisStore } = require('connect-redis');
const Redis = require('ioredis');

let store;
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  const redisClient = new Redis(process.env.REDIS_URL);

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
    store = new session.MemoryStore();
    console.warn('Redis failed, falling back to MemoryStore');
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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'none',
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
  },
});