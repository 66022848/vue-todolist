require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // นำเข้า authRoutes

const app = express();
const port = 3000;

// เปิดใช้งาน CORS
app.use(cors());

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log("MongoDB connection error:", err));

console.log("MONGODB_URI:", process.env.MONGODB_URI);

// ใช้ middleware เพื่อรับข้อมูล JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ใช้ authRoutes สำหรับเส้นทางที่เกี่ยวข้องกับการเข้าสู่ระบบและลงทะเบียน
app.use('/api/auth', authRoutes);

// เปิด server ที่พอร์ต 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
