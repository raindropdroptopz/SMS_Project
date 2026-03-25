const { prisma } = require('../config/db');

exports.getPrograms = async (req, res) => {
  try {
    const where = {};
    if (req.query.department_id) where.department_id = Number(req.query.department_id);
    if (req.query.level) where.level = req.query.level;

    const programs = await prisma.programs.findMany({
      where,
      orderBy: { program_id: 'asc' },
      include: { departments: { select: { code: true, name_th: true } } }
    });
    return res.json({ success: true, data: programs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const program_id = Number(req.params.id);
    if (!Number.isInteger(program_id) || program_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid program ID' });

    const program = await prisma.programs.findUnique({
      where: { program_id },
      include: { departments: { select: { code: true, name_th: true } } }
    });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    return res.json({ success: true, data: program });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const { department_id, code, name_th, name_en, level } = req.body;
    if (!department_id || !code || !name_th || !level)
      return res.status(400).json({ success: false, message: 'Required: department_id, code, name_th, level' });

    const created = await prisma.programs.create({
      data: { department_id: Number(department_id), code, name_th, name_en: name_en ?? null, level }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Program code already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program_id = Number(req.params.id);
    if (!Number.isInteger(program_id) || program_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid program ID' });

    const { department_id, code, name_th, name_en, level } = req.body;
    const updateData = {};
    if (department_id !== undefined) updateData.department_id = Number(department_id);
    if (code !== undefined) updateData.code = code;
    if (name_th !== undefined) updateData.name_th = name_th;
    if (name_en !== undefined) updateData.name_en = name_en;
    if (level !== undefined) updateData.level = level;

    const updated = await prisma.programs.update({ where: { program_id }, data: updateData });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Program not found' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Program code already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program_id = Number(req.params.id);
    if (!Number.isInteger(program_id) || program_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid program ID' });

    await prisma.programs.delete({ where: { program_id } });
    return res.json({ success: true, message: 'Program deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Program not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
