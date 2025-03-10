const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');

let store;
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  const redisClient = new Redis(process.env.REDIS_URL);
  redisClient.on('connect', () => console.log('Connected to Redis'));
  redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
    console.warn('Redis failed, falling back to MemoryStore');
    store = new session.MemoryStore();
  });
  store = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: 24 * 60 * 60,
  });
} else {
  store = new session.MemoryStore();
  console.warn('Using MemoryStore for session - Not ideal for production');
}

const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET || 'your-default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'none',
  },
});

module.exports = { sessionMiddleware };
