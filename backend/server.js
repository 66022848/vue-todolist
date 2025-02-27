// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:8081", // อนุญาตให้ frontend ใช้ API
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // ใช้ cookies และ authorization headers
  })
);

// ตั้งค่า Headers เพื่อแก้ปัญหา Cross-Origin-Opener-Policy (COOP)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // ✅ เปลี่ยนจาก "credentialless" เป็น "require-corp"
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.options("*", cors()); // ✅ รองรับ HTTP OPTIONS request


// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);

// Middleware JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routing สำหรับ Auth (ลงทะเบียน, เข้าสู่ระบบ, Google Login)
app.use("/api/auth", authRoutes);

// ✅ Routing สำหรับ Tasks
app.use("/api/tasks", taskRoutes);

// ✅ Routing สำหรับ Google Login
app.use("/api/auth/google-login", googleAuthRoutes); // เปลี่ยน path ให้ชัดเจน

// เปิด Server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
