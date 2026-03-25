const bcrypt = require('bcrypt');
const { prisma } = require('../config/db');
const { signToken } = require('../utils/jwt');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'username และ password จำเป็นต้องมี' });

    const user = await prisma.users.findUnique({ where: { username } });
    if (!user)
      return res.status(401).json({ success: false, message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' });

    if (user.is_active === false)
      return res.status(403).json({ success: false, message: 'บัญชีถูกระงับการใช้งาน' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ success: false, message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' });

    await prisma.users.update({
      where: { user_id: user.user_id },
      data: { last_login: new Date() }
    });

    const token = signToken({
      userId: user.user_id,
      role: user.role,
      studentId: user.student_id || null,
      instructorId: user.instructor_id || null,
    });

    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          student_id: user.student_id,
          instructor_id: user.instructor_id,
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่ server', error: String(err) });
  }
}

async function me(req, res) {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.userId },
      select: {
        user_id: true, username: true, role: true,
        student_id: true, instructor_id: true,
        is_active: true, last_login: true, created_at: true, updated_at: true,
      },
    });
    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่ server' });
  }
}

async function logout(req, res) {
  return res.status(200).json({ success: true, message: 'ออกจากระบบสำเร็จ (ให้ลบ token ฝั่ง client)' });
}

module.exports = { login, me, logout };
