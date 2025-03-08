const express = require('express');
const router = express.Router();
const { getTaskCounts } = require('../controllers/tasksController');

// Middleware ตรวจสอบ session
function authenticateSession(req, res, next) {
  // ตรวจสอบ session จาก cookie (ถ้าใช้ express-session)
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: No active session' });
  }
  next(); // ถ้ามี session ให้ดำเนินการต่อ
}

// หรือใช้ sessionId จาก Authorization header (ตามแนวทางก่อนหน้า)
function authenticateWithSessionId(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Session ')) {
    return res.status(401).json({ message: 'Unauthorized: No session ID' });
  }
  const sessionId = authHeader.split(' ')[1];
  // ตรวจสอบ sessionId กับ Redis หรือ store (ถ้ามี)
  req.sessionID = sessionId; // ตั้งค่า sessionID เพื่อให้ middleware session ใช้ได้
  next();
}

router.get('/counts', authenticateSession, getTaskCounts); // ใช้ authenticateSession สำหรับ session-based
// หรือใช้ authenticateWithSessionId ถ้าเปลี่ยนไปใช้ sessionId
// router.get('/counts', authenticateWithSessionId, getTaskCounts);

module.exports = router;