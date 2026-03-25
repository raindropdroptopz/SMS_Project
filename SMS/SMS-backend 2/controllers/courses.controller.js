const { prisma } = require('../config/db');

exports.getCourses = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.department_id) where.department_id = Number(req.query.department_id);

    const [courses, total] = await Promise.all([
      prisma.courses.findMany({
        where, skip, take: limit,
        orderBy: { course_code: 'asc' },
        include: { departments: { select: { code: true, name_th: true } } }
      }),
      prisma.courses.count({ where })
    ]);
    return res.json({ success: true, data: courses, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course_id = Number(req.params.id);
    if (!Number.isInteger(course_id) || course_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid course ID' });

    const course = await prisma.courses.findUnique({
      where: { course_id },
      include: { departments: { select: { code: true, name_th: true } } }
    });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    return res.json({ success: true, data: course });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { department_id, course_code, course_name_th, course_name_en, credit, lecture_hour, lab_hour, description } = req.body;
    if (!department_id || !course_code || !course_name_th || credit === undefined)
      return res.status(400).json({ success: false, message: 'Required: department_id, course_code, course_name_th, credit' });

    const created = await prisma.courses.create({
      data: {
        department_id: Number(department_id),
        course_code,
        course_name_th,
        course_name_en: course_name_en ?? null,
        credit: parseFloat(credit),
        lecture_hour: lecture_hour ? Number(lecture_hour) : null,
        lab_hour: lab_hour ? Number(lab_hour) : null,
        description: description ?? null
      }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Course code already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course_id = Number(req.params.id);
    if (!Number.isInteger(course_id) || course_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid course ID' });

    const { department_id, course_code, course_name_th, course_name_en, credit, lecture_hour, lab_hour, description } = req.body;
    const updateData = {};
    if (department_id !== undefined) updateData.department_id = Number(department_id);
    if (course_code !== undefined) updateData.course_code = course_code;
    if (course_name_th !== undefined) updateData.course_name_th = course_name_th;
    if (course_name_en !== undefined) updateData.course_name_en = course_name_en;
    if (credit !== undefined) updateData.credit = parseFloat(credit);
    if (lecture_hour !== undefined) updateData.lecture_hour = Number(lecture_hour);
    if (lab_hour !== undefined) updateData.lab_hour = Number(lab_hour);
    if (description !== undefined) updateData.description = description;

    const updated = await prisma.courses.update({ where: { course_id }, data: updateData });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Course not found' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Course code already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course_id = Number(req.params.id);
    if (!Number.isInteger(course_id) || course_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid course ID' });

    await prisma.courses.delete({ where: { course_id } });
    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Course not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
