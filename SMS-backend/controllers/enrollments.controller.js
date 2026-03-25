// controllers/enrollments.controller.js

const { prisma } = require('../config/db');

// GET /enrollments?page=1&limit=20&student_id=&section_id=
exports.getEnrollments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.student_id) where.student_id = Number(req.query.student_id);
    if (req.query.section_id) where.section_id = Number(req.query.section_id);

    const [enrollments, total] = await Promise.all([
      prisma.enrollments.findMany({
        where,
        skip,
        take: limit,
        orderBy: { enrollment_id: 'asc' },
        include: {
          students: { select: { student_no: true, first_name_th: true, last_name_th: true } },
          class_sections: { select: { section_no: true, courses: { select: { course_code: true, course_name_th: true } } } }
        }
      }),
      prisma.enrollments.count({ where })
    ]);

    return res.json({
      success: true,
      data: enrollments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /enrollments/:id
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment_id = Number(req.params.id);
    if (!Number.isInteger(enrollment_id) || enrollment_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid enrollment ID' });
    }

    const enrollment = await prisma.enrollments.findUnique({
      where: { enrollment_id },
      include: {
        students: { select: { student_no: true, first_name_th: true, last_name_th: true } },
        class_sections: { select: { section_no: true, courses: { select: { course_code: true, course_name_th: true } } } }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    return res.json({ success: true, data: enrollment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /enrollments
exports.createEnrollment = async (req, res) => {
  try {
    const { student_id, section_id, enroll_date } = req.body;

    if (!student_id || !section_id) {
      return res.status(400).json({ success: false, message: 'Required fields: student_id, section_id' });
    }

    const created = await prisma.enrollments.create({
      data: {
        student_id: Number(student_id),
        section_id: Number(section_id),
        enroll_date: enroll_date ? new Date(enroll_date) : new Date(),
        status: 'enrolled'
      }
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(400).json({ success: false, message: 'Student or section not found' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /enrollments/:id
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment_id = Number(req.params.id);
    if (!Number.isInteger(enrollment_id) || enrollment_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid enrollment ID' });
    }

    const { status, final_score, final_grade } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (final_score !== undefined) updateData.final_score = parseFloat(final_score);
    if (final_grade !== undefined) updateData.final_grade = final_grade;

    const updated = await prisma.enrollments.update({
      where: { enrollment_id },
      data: updateData
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /enrollments/:id
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment_id = Number(req.params.id);
    if (!Number.isInteger(enrollment_id) || enrollment_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid enrollment ID' });
    }

    await prisma.enrollments.delete({ where: { enrollment_id } });

    return res.json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};
