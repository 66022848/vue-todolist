const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้
const registerUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // ตรวจสอบว่าอีเมลนี้มีผู้ใช้ลงทะเบียนแล้วหรือไม่
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password before saving:', hashedPassword); // เพิ่มบรรทัดนี้

    // หากไม่มีผู้ใช้ ให้สร้างผู้ใช้ใหม่
    user = new User({
      email,
      password: hashedPassword, // บันทึกรหัสผ่านแบบเข้ารหัส
      rememberMe,
    });

    await user.save();

    // สร้าง JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '7d' : '1h' }); // หาก rememberMe เป็น true ใช้เวลา 7 วัน

    res.json({ message: 'User registered successfully', user, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration', error });
  }
};

// ฟังก์ชันสำหรับการเข้าสู่ระบบผู้ใช้
const loginUser = async (req, res) => {
  try {
    // ตรวจสอบข้อมูลที่ได้รับจาก Front-End
    console.log('Login Data:', req.body); // ดูข้อมูลที่ได้รับจาก client

    const { email, password, rememberMe } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
    console.log('User not found');
    return res.status(400).json({ message: 'User not found' });
    }

    console.log('Stored password (hashed):', user.password); // เพิ่มบรรทัดนี้

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
    }

    // อัปเดตข้อมูลการเข้าสู่ระบบ
    user.rememberMe = rememberMe;
    await user.save();

    // สร้าง JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '7d' : '1h' }); // หาก rememberMe เป็น true ใช้เวลา 7 วัน

    res.json({ message: 'User logged in successfully', user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

module.exports = { registerUser, loginUser };
