const express = require('express');
const router = express.Router();

const controller = require('../controllers/attendance.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// GET /attendance?page=&limit=&student_id=&section_id=&date=
router.get('/', requireAuth, controller.getAttendance);

// GET /attendance/:id
router.get('/:id', requireAuth, controller.getAttendanceById);

// POST /attendance
router.post('/', requireAuth, requireRole('admin', 'staff', 'instructor'), controller.createAttendance);

// PUT /attendance/:id
router.put('/:id', requireAuth, requireRole('admin', 'staff', 'instructor'), controller.updateAttendance);

// DELETE /attendance/:id
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteAttendance);

module.exports = router;
