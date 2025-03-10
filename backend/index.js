const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { customSessionMiddleware } = require('./middlewares/sessionMiddleware');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();

// การเชื่อมต่อ MongoDB
async function connectDB() {
  const options = {
    serverSelectionTimeoutMS: 30000, // เพิ่ม timeout เป็น 30 วินาที
    heartbeatFrequencyMS: 10000, // ตรวจสอบการเชื่อมต่อทุก 10 วินาที
    maxPoolSize: 10,
  };
  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('เชื่อมต่อกับ MongoDB สำเร็จ');
  } catch (err) {
    console.error('ข้อผิดพลาดการเชื่อมต่อ MongoDB:', err);
    setTimeout(connectDB, 5000); // ลองใหม่ทุก 5 วินาที
  }
}
connectDB();

// ตั้งค่า CORS
app.use(cors({
  origin: 'https://66022848.github.io',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ยินดีต้อนรับสู่ vue-todolist-backend API!' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/quest', require('./routes/quest'));
app.use('/api/tasks', require('./routes/tasks'));

// Error handling
app.use((err, req, res, next) => {
  console.error('ข้อผิดพลาด:', err.stack);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดบางอย่าง!', error: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend ทำงานบนพอร์ต ${port}`);
});