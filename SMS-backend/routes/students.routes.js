const express = require('express');
const router = express.Router();

const controller = require('../controllers/students.controller');
const { upload } = require('../middleware/upload');
const validateUpload = require('../middleware/validateUpload');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// GET /students
router.get('/', requireAuth, controller.getStudents);

// POST /students
router.post('/', requireAuth, requireRole('admin', 'staff'), controller.createStudent);

// GET /students/:id
router.get('/:id', requireAuth, controller.getStudentById);

// PUT /students/:id
router.put('/:id', requireAuth, requireRole('admin', 'staff'), controller.updateStudent);

// DELETE /students/:id
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteStudent);

// POST /students/:id/photo
router.post(
  '/:id/photo',
  requireAuth,
  requireRole('admin', 'staff'),
  upload.single('photo'),
  validateUpload,
  controller.uploadStudentPhoto
);

module.exports = router;

// ===== Nested routes =====

// GET /students/:id/enrollments
router.get('/:id/enrollments', requireAuth, async (req, res) => {
  try {
    const student_id = Number(req.params.id);
    if (!Number.isInteger(student_id) || student_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid student ID' });

    const { prisma } = require('../config/db');
    const enrollments = await prisma.enrollments.findMany({
      where: { student_id },
      orderBy: { enrollment_id: 'asc' },
      include: {
        class_sections: {
          include: {
            courses: { select: { course_code: true, course_name_th: true, credit: true } },
            semesters: { select: { academic_year: true, term: true } },
            instructors: { select: { prefix: true, first_name_th: true, last_name_th: true } }
          }
        }
      }
    });
    return res.json({ success: true, data: enrollments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /students/:id/attendance
router.get('/:id/attendance', requireAuth, async (req, res) => {
  try {
    const student_id = Number(req.params.id);
    if (!Number.isInteger(student_id) || student_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid student ID' });

    const { prisma } = require('../config/db');
    const where = { student_id };
    if (req.query.section_id) where.section_id = Number(req.query.section_id);

    const records = await prisma.attendance_records.findMany({
      where,
      orderBy: { attendance_date: 'desc' },
      include: {
        class_sections: {
          select: {
            section_no: true,
            courses: { select: { course_code: true, course_name_th: true } }
          }
        }
      }
    });
    return res.json({ success: true, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
