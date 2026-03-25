// controllers/attendance.controller.js

const { prisma } = require('../config/db');

// GET /attendance?page=1&limit=20&student_id=&section_id=&date=
exports.getAttendance = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.student_id) where.student_id = Number(req.query.student_id);
    if (req.query.section_id) where.section_id = Number(req.query.section_id);
    if (req.query.date) where.attendance_date = new Date(req.query.date);

    const [records, total] = await Promise.all([
      prisma.attendance_records.findMany({
        where,
        skip,
        take: limit,
        orderBy: { attendance_date: 'desc' },
        include: {
          students: { select: { student_no: true, first_name_th: true, last_name_th: true } },
          class_sections: { select: { section_no: true, courses: { select: { course_code: true, course_name_th: true } } } }
        }
      }),
      prisma.attendance_records.count({ where })
    ]);

    return res.json({
      success: true,
      data: records,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /attendance/:id
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance_id = Number(req.params.id);
    if (!Number.isInteger(attendance_id) || attendance_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid attendance ID' });
    }

    const record = await prisma.attendance_records.findUnique({
      where: { attendance_id },
      include: {
        students: { select: { student_no: true, first_name_th: true, last_name_th: true } },
        class_sections: { select: { section_no: true } }
      }
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    return res.json({ success: true, data: record });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /attendance
exports.createAttendance = async (req, res) => {
  try {
    const { section_id, student_id, attendance_date, status, note } = req.body;

    if (!section_id || !student_id || !attendance_date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: section_id, student_id, attendance_date, status'
      });
    }

    const created = await prisma.attendance_records.create({
      data: {
        section_id: Number(section_id),
        student_id: Number(student_id),
        attendance_date: new Date(attendance_date),
        status,
        note: note ?? null
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

// PUT /attendance/:id
exports.updateAttendance = async (req, res) => {
  try {
    const attendance_id = Number(req.params.id);
    if (!Number.isInteger(attendance_id) || attendance_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid attendance ID' });
    }

    const { status, note } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (note !== undefined) updateData.note = note;

    const updated = await prisma.attendance_records.update({
      where: { attendance_id },
      data: updateData
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /attendance/:id
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance_id = Number(req.params.id);
    if (!Number.isInteger(attendance_id) || attendance_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid attendance ID' });
    }

    await prisma.attendance_records.delete({ where: { attendance_id } });

    return res.json({ success: true, message: 'Attendance record deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};
