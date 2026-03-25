// controllers/students.controller.js

const { prisma } = require('../config/db');

function parseStudentId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// GET /students?page=1&limit=20
exports.getStudents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.students.findMany({
        skip,
        take: limit,
        orderBy: { student_id: 'asc' }
      }),
      prisma.students.count()
    ]);

    return res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await prisma.students.findUnique({ where: { student_id } });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.json({ success: true, data: student });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /students
exports.createStudent = async (req, res) => {
  try {
    const { student_no, first_name_th, last_name_th, program_id, email, phone, status } = req.body;

    if (!student_no || !first_name_th || !last_name_th || program_id === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: student_no, first_name_th, last_name_th, program_id'
      });
    }

    const created = await prisma.students.create({
      data: {
        student_no,
        first_name_th,
        last_name_th,
        program_id: Number(program_id),
        email: email ?? null,
        phone: phone ?? null,
        status: status ?? 'active'
      }
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Student number already exists' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /students/:id
exports.updateStudent = async (req, res) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const { student_no, first_name_th, last_name_th, program_id, email, phone, status } = req.body;

    const updateData = {};
    if (student_no !== undefined) updateData.student_no = student_no;
    if (first_name_th !== undefined) updateData.first_name_th = first_name_th;
    if (last_name_th !== undefined) updateData.last_name_th = last_name_th;
    if (program_id !== undefined) updateData.program_id = Number(program_id);
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.students.update({
      where: { student_id },
      data: updateData
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Student number already exists' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    await prisma.students.delete({ where: { student_id } });

    return res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /students/:id/photo
exports.uploadStudentPhoto = async (req, res, next) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await prisma.students.findUnique({ where: { student_id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const file = req.file;
    const photoPath = `/uploads/students/${file.filename}`;

    await prisma.students.update({
      where: { student_id },
      data: { photo: photoPath }
    });

    return res.status(200).json({
      success: true,
      message: 'Upload success',
      data: {
        student_id,
        photo: photoPath
      }
    });
  } catch (err) {
    return next(err);
  }
};
