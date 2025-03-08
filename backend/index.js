const express = require('express');
const cors = require('cors');
const { sessionMiddleware } = require('./middlewares/sessionMiddleware');
const passport = require('./config/passport');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// การเชื่อมต่อ MongoDB พร้อมการ Retry
async function connectDB() {
  const options = {
    serverSelectionTimeoutMS: 30000, // เพิ่ม timeout เป็น 30 วินาที
    heartbeatFrequencyMS: 10000, // ตรวจสอบการเชื่อมต่อทุก 10 วินาที
    maxPoolSize: 10, // จำนวนการเชื่อมต่อสูงสุด
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('เชื่อมต่อกับ MongoDB สำเร็จ');
  } catch (err) {
    console.error('ข้อผิดพลาดการเชื่อมต่อ MongoDB:', err);
    setTimeout(connectDB, 5000); // ลองเชื่อมใหม่ทุก 5 วินาที
  }
}

connectDB();

module.exports = mongoose;

// การตั้งค่า CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://66022848.github.io',
    'https://66022848.github.io/vue-todolist'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // บาง browser รุ่นเก่ามีปัญหากับสถานะ 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // เปิดใช้งาน pre-flight requests

app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'ยินดีต้อนรับสู่ vue-todolist-backend API! ใช้ /api/... สำหรับ endpoints.' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/quest', require('./routes/quest'));
app.use('/api/tasks', require('./routes/tasks'));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend ทำงานบนพอร์ต ${port}`);
});

// Middleware จัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดบางอย่าง!', error: err.message });
});