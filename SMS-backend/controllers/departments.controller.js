const { prisma } = require('../config/db');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await prisma.departments.findMany({
      orderBy: { department_id: 'asc' }
    });
    return res.json({ success: true, data: departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department_id = Number(req.params.id);
    if (!Number.isInteger(department_id) || department_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid department ID' });

    const department = await prisma.departments.findUnique({
      where: { department_id },
      include: {
        programs: { select: { program_id: true, code: true, name_th: true, level: true } }
      }
    });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    return res.json({ success: true, data: department });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { code, name_th, name_en } = req.body;
    if (!code || !name_th)
      return res.status(400).json({ success: false, message: 'Required: code, name_th' });

    const created = await prisma.departments.create({
      data: { code, name_th, name_en: name_en ?? null }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Department code already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department_id = Number(req.params.id);
    if (!Number.isInteger(department_id) || department_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid department ID' });

    const { code, name_th, name_en } = req.body;
    const updateData = {};
    if (code !== undefined) updateData.code = code;
    if (name_th !== undefined) updateData.name_th = name_th;
    if (name_en !== undefined) updateData.name_en = name_en;

    const updated = await prisma.departments.update({ where: { department_id }, data: updateData });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Department not found' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Department code already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department_id = Number(req.params.id);
    if (!Number.isInteger(department_id) || department_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid department ID' });

    await prisma.departments.delete({ where: { department_id } });
    return res.json({ success: true, message: 'Department deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Department not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
