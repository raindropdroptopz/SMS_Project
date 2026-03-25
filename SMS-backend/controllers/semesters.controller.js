const { prisma } = require('../config/db');

exports.getSemesters = async (req, res) => {
  try {
    const semesters = await prisma.semesters.findMany({
      orderBy: [{ academic_year: 'desc' }, { term: 'asc' }]
    });
    return res.json({ success: true, data: semesters });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSemesterById = async (req, res) => {
  try {
    const semester_id = Number(req.params.id);
    if (!Number.isInteger(semester_id) || semester_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid semester ID' });

    const semester = await prisma.semesters.findUnique({ where: { semester_id } });
    if (!semester) return res.status(404).json({ success: false, message: 'Semester not found' });
    return res.json({ success: true, data: semester });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSemester = async (req, res) => {
  try {
    const { academic_year, term, start_date, end_date } = req.body;
    if (!academic_year || !term)
      return res.status(400).json({ success: false, message: 'Required: academic_year, term' });

    const created = await prisma.semesters.create({
      data: {
        academic_year: Number(academic_year),
        term: Number(term),
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null
      }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const semester_id = Number(req.params.id);
    if (!Number.isInteger(semester_id) || semester_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid semester ID' });

    const { academic_year, term, start_date, end_date } = req.body;
    const updateData = {};
    if (academic_year !== undefined) updateData.academic_year = Number(academic_year);
    if (term !== undefined) updateData.term = Number(term);
    if (start_date !== undefined) updateData.start_date = new Date(start_date);
    if (end_date !== undefined) updateData.end_date = new Date(end_date);

    const updated = await prisma.semesters.update({ where: { semester_id }, data: updateData });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Semester not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSemester = async (req, res) => {
  try {
    const semester_id = Number(req.params.id);
    if (!Number.isInteger(semester_id) || semester_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid semester ID' });

    await prisma.semesters.delete({ where: { semester_id } });
    return res.json({ success: true, message: 'Semester deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Semester not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
