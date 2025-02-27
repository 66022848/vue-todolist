const express = require("express");
const axios = require("axios");
const router = express.Router();

// Route สำหรับเริ่มกระบวนการ OAuth 2.0
router.get("/google", (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    console.log('Redirect URI:', process.env.REDIRECT_URI);  // ตรวจสอบว่าแสดงค่าเป็น http://localhost:3000/api/auth/google/callback หรือไม่
    res.redirect(url);
  });
  
  // Callback URL ที่ Google จะเรียกเมื่อผู้ใช้ยืนยันตัวตน
  router.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      });
  
      const { access_token } = data;
      const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      req.session.user = profile;
      res.redirect("http://localhost:8081/dashboard/home"); // เปลี่ยนไปหน้า frontend
    } catch (error) {
      console.error(error);
      res.redirect("http://localhost:8081/login");
    }
  });
  
  module.exports = router;