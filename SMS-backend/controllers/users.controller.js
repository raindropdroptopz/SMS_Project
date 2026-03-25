const bcrypt = require('bcrypt');
const { prisma } = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.role) where.role = req.query.role;
    if (req.query.is_active !== undefined) where.is_active = req.query.is_active === 'true';

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where, skip, take: limit,
        orderBy: { user_id: 'asc' },
        select: {
          user_id: true, username: true, role: true,
          student_id: true, instructor_id: true,
          is_active: true, last_login: true, created_at: true
        }
      }),
      prisma.users.count({ where })
    ]);
    return res.json({ success: true, data: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user_id = Number(req.params.id);
    if (!Number.isInteger(user_id) || user_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid user ID' });

    const user = await prisma.users.findUnique({
      where: { user_id },
      select: {
        user_id: true, username: true, role: true,
        student_id: true, instructor_id: true,
        is_active: true, last_login: true, created_at: true, updated_at: true
      }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, student_id, instructor_id } = req.body;
    if (!username || !password || !role)
      return res.status(400).json({ success: false, message: 'Required: username, password, role' });

    const password_hash = await bcrypt.hash(password, 10);
    const created = await prisma.users.create({
      data: {
        username,
        password_hash,
        role,
        student_id: student_id ? Number(student_id) : null,
        instructor_id: instructor_id ? Number(instructor_id) : null,
        is_active: true
      },
      select: {
        user_id: true, username: true, role: true,
        student_id: true, instructor_id: true, is_active: true, created_at: true
      }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Username already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user_id = Number(req.params.id);
    if (!Number.isInteger(user_id) || user_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid user ID' });

    const { password, role, is_active, student_id, instructor_id } = req.body;
    const updateData = {};
    if (password) updateData.password_hash = await bcrypt.hash(password, 10);
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);
    if (student_id !== undefined) updateData.student_id = student_id ? Number(student_id) : null;
    if (instructor_id !== undefined) updateData.instructor_id = instructor_id ? Number(instructor_id) : null;
    updateData.updated_at = new Date();

    const updated = await prisma.users.update({
      where: { user_id },
      data: updateData,
      select: {
        user_id: true, username: true, role: true,
        student_id: true, instructor_id: true, is_active: true, updated_at: true
      }
    });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user_id = Number(req.params.id);
    if (!Number.isInteger(user_id) || user_id <= 0)
      return res.status(400).json({ success: false, message: 'Invalid user ID' });

    await prisma.users.delete({ where: { user_id } });
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(500).json({ success: false, message: err.message });
  }
};
