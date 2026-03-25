const express = require('express');
const router = express.Router();

const controller = require('../controllers/enrollments.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// GET /enrollments?page=&limit=&student_id=&section_id=
router.get('/', requireAuth, controller.getEnrollments);

// GET /enrollments/:id
router.get('/:id', requireAuth, controller.getEnrollmentById);

// POST /enrollments
router.post('/', requireAuth, requireRole('admin', 'staff'), controller.createEnrollment);

// PUT /enrollments/:id  (อัปเดตเกรด/สถานะ)
router.put('/:id', requireAuth, requireRole('admin', 'staff', 'instructor'), controller.updateEnrollment);

// DELETE /enrollments/:id
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteEnrollment);

module.exports = router;
