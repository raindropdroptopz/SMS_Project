const { prisma } = require('../config/db');

// Prisma $queryRawUnsafe returns BigInt for numeric columns — convert to Number
function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? Number(v) : v)));
}

exports.getInstructors = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const searchQ = (req.query.search || '').trim();
    const statusQ = (req.query.status || '').trim();

    if (searchQ) {
      // Use raw SQL for case-insensitive LIKE search (MySQL doesn't support Prisma's mode:'insensitive')
      const like = `%${searchQ}%`;
      const whereStatus = statusQ ? `AND status = '${statusQ.replace(/'/g, "''")}'` : '';

      const [instructors, countResult] = await Promise.all([
        prisma.$queryRawUnsafe(`
          SELECT * FROM instructors
          WHERE (
            employee_no LIKE ? OR
            first_name_th LIKE ? OR
            last_name_th LIKE ? OR
            first_name_en LIKE ? OR
            last_name_en LIKE ? OR
            email LIKE ?
          ) ${whereStatus}
          ORDER BY instructor_id ASC
          LIMIT ? OFFSET ?
        `, like, like, like, like, like, like, limit, skip),
        prisma.$queryRawUnsafe(`
          SELECT COUNT(*) as total FROM instructors
          WHERE (
            employee_no LIKE ? OR
            first_name_th LIKE ? OR
            last_name_th LIKE ? OR
            first_name_en LIKE ? OR
            last_name_en LIKE ? OR
            email LIKE ?
          ) ${whereStatus}
        `, like, like, like, like, like, like)
      ]);

      const total = Number(countResult[0]?.total || 0);
      return res.json({
        success: true,
        data: serializeBigInt(instructors),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    }

    // No search — use Prisma ORM normally
    const where = {};
    if (statusQ) where.status = statusQ;

    const [instructors, total] = await Promise.all([
      prisma.instructors.findMany({ where, skip, take: limit, orderBy: { instructor_id: 'asc' } }),
      prisma.instructors.count({ where })
    ]);
    return res.json({ success: true, data: instructors, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const instructor_id = Number(req.params.id);
    if (!Number.isInteger(instructor_id) || instructor_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });

    const instructor = await prisma.instructors.findUnique({ where: { instructor_id } });
    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });
    return res.json({ success: true, data: instructor });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createInstructor = async (req, res) => {
  try {
    const { employee_no, prefix, first_name_th, last_name_th, first_name_en, last_name_en, email, phone, status } = req.body;
    if (!employee_no || !first_name_th || !last_name_th)
      return res.status(400).json({ success: false, message: 'Required: employee_no, first_name_th, last_name_th' });

    const created = await prisma.instructors.create({
      data: {
        employee_no,
        prefix: prefix ?? null,
        first_name_th,
        last_name_th,
        first_name_en: first_name_en ?? null,
        last_name_en: last_name_en ?? null,
        email: email ?? null,
        phone: phone ?? null,
        status: status ?? 'active'
      }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Employee number already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    const instructor_id = Number(req.params.id);
    if (!Number.isInteger(instructor_id) || instructor_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });

    const { employee_no, prefix, first_name_th, last_name_th, first_name_en, last_name_en, email, phone, status } = req.body;
    const updateData = {};
    if (employee_no !== undefined) updateData.employee_no = employee_no;
    if (prefix !== undefined) updateData.prefix = prefix;
    if (first_name_th !== undefined) updateData.first_name_th = first_name_th;
    if (last_name_th !== undefined) updateData.last_name_th = last_name_th;
    if (first_name_en !== undefined) updateData.first_name_en = first_name_en;
    if (last_name_en !== undefined) updateData.last_name_en = last_name_en;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.instructors.update({ where: { instructor_id }, data: updateData });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Instructor not found' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Employee number already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const instructor_id = Number(req.params.id);
    if (!Number.isInteger(instructor_id) || instructor_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });

    await prisma.instructors.delete({ where: { instructor_id } });
    return res.json({ success: true, message: 'Instructor deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Instructor not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
