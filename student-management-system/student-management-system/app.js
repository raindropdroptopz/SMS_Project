const express = require('express');
const cors = require("cors");

const path = require('path');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const studentRoutes = require('./routes/students.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware พื้นฐาน
app.use(logger);

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

// ใช้ทดสอบฟอร์มอัปโหลดผ่าน public/index.html (optional)
app.use(express.static(path.join(__dirname, 'public')));


// เปิดให้ client เข้าถึงไฟล์ที่อัปโหลดได้
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตั้งค่า View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);

// หน้า Home แบบง่าย
app.get('/', (req, res) => {
  res.send('SMS Project is running');
});

// 404 handler (ต้องมาก่อน errorHandler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// error handler (ต้องอยู่ท้ายสุดเสมอ)
app.use(errorHandler);

module.exports = app;