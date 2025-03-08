const session = require('express-session');
const { RedisStore } = require('connect-redis');
const Redis = require('ioredis');

let store;
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  const redisClient = new Redis(process.env.REDIS_URL);

  redisClient.on('connect', () => {
    console.log('เชื่อมต่อกับ Redis สำเร็จ');
  });
  redisClient.on('error', (err) => {
    console.error('ข้อผิดพลาด Redis Client:', err);
    store = new session.MemoryStore();
    console.warn('Redis ล้มเหลว ใช้ MemoryStore แทน ไม่แนะนำสำหรับ production');
  });

  store = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: 24 * 60 * 60 // 24 ชั่วโมง
  });
} else {
  store = new session.MemoryStore();
  console.warn('ใช้ MemoryStore - ไม่เหมาะสำหรับ production เว้นแต่ชั่วคราว');
}

const sessionMiddleware = session({
  store: store,
  secret: process.env.SESSION_SECRET || 'your-default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 ชั่วโมง
    sameSite: 'none',
  },
});

module.exports = { sessionMiddleware, store };