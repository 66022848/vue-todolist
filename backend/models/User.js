const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const emailRegex = /^[a-zA-Z0-9._-]+@up.ac.th$/;

// สร้าง schema สำหรับผู้ใช้
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [emailRegex, 'Please enter a valid UP email address.'] 
  },
  password: { type: String, required: true },
  rememberMe: { type: Boolean, default: false }
});

// การเข้ารหัสรหัสผ่านก่อนการบันทึกในฐานข้อมูล
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// ฟังก์ชันตรวจสอบรหัสผ่าน
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
