const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/students.routes');
const enrollmentRoutes = require('./routes/enrollments.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const programRoutes = require('./routes/programs.routes');
const departmentRoutes = require('./routes/departments.routes');
const courseRoutes = require('./routes/courses.routes');
const sectionRoutes = require('./routes/class-sections.routes');
const semesterRoutes = require('./routes/semesters.routes');
const instructorRoutes = require('./routes/instructors.routes');
const userRoutes = require('./routes/users.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(logger);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/students', studentRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/programs', programRoutes);
app.use('/departments', departmentRoutes);
app.use('/courses', courseRoutes);
app.use('/class-sections', sectionRoutes);
app.use('/semesters', semesterRoutes);
app.use('/instructors', instructorRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SMS API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
