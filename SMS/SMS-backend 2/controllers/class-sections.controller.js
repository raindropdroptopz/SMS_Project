const { prisma } = require('../config/db');

exports.getSections = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.course_id) where.course_id = Number(req.query.course_id);
    if (req.query.semester_id) where.semester_id = Number(req.query.semester_id);
    if (req.query.instructor_id) where.instructor_id = Number(req.query.instructor_id);

    const [sections, total] = await Promise.all([
      prisma.class_sections.findMany({
        where, skip, take: limit,
        orderBy: { section_id: 'asc' },
        include: {
          courses: { select: { course_code: true, course_name_th: true, credit: true } },
          semesters: { select: { academic_year: true, term: true } },
          instructors: { select: { prefix: true, first_name_th: true, last_name_th: true } }
        }
      }),
      prisma.class_sections.count({ where })
    ]);
    return res.json({ success: true, data: sections, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const section_id = Number(req.params.id);
    if (!Number.isInteger(section_id) || section_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid section ID' });

    const section = await prisma.class_sections.findUnique({
      where: { section_id },
      include: {
        courses: { select: { course_code: true, course_name_th: true, credit: true } },
        semesters: { select: { academic_year: true, term: true, start_date: true, end_date: true } },
        instructors: { select: { prefix: true, first_name_th: true, last_name_th: true, email: true } },
        enrollments: { include: { students: { select: { student_no: true, first_name_th: true, last_name_th: true } } } }
      }
    });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    return res.json({ success: true, data: section });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { course_id, semester_id, section_no, instructor_id, classroom, schedule_info, capacity } = req.body;
    if (!course_id || !semester_id || !section_no || !instructor_id)
      return res.status(400).json({ success: false, message: 'Required: course_id, semester_id, section_no, instructor_id' });

    const created = await prisma.class_sections.create({
      data: {
        course_id: Number(course_id),
        semester_id: Number(semester_id),
        section_no,
        instructor_id: Number(instructor_id),
        classroom: classroom ?? null,
        schedule_info: schedule_info ?? null,
        capacity: capacity ? Number(capacity) : null
      }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2003') return res.status(400).json({ success: false, message: 'Course, semester, or instructor not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const section_id = Number(req.params.id);
    if (!Number.isInteger(section_id) || section_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid section ID' });

    const { course_id, semester_id, section_no, instructor_id, classroom, schedule_info, capacity } = req.body;
    const updateData = {};
    if (course_id !== undefined) updateData.course_id = Number(course_id);
    if (semester_id !== undefined) updateData.semester_id = Number(semester_id);
    if (section_no !== undefined) updateData.section_no = section_no;
    if (instructor_id !== undefined) updateData.instructor_id = Number(instructor_id);
    if (classroom !== undefined) updateData.classroom = classroom;
    if (schedule_info !== undefined) updateData.schedule_info = schedule_info;
    if (capacity !== undefined) updateData.capacity = Number(capacity);

    const updated = await prisma.class_sections.update({ where: { section_id }, data: updateData });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Section not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const section_id = Number(req.params.id);
    if (!Number.isInteger(section_id) || section_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid section ID' });

    await prisma.class_sections.delete({ where: { section_id } });
    return res.json({ success: true, message: 'Section deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Section not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
