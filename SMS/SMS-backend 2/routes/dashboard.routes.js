const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const { requireAuth } = require('../middleware/auth.middleware');

// GET /dashboard/stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [students, instructors, courses, sections] = await Promise.all([
      prisma.students.count(),
      prisma.instructors.count(),
      prisma.courses.count(),
      prisma.class_sections.count(),
    ]);
    return res.json({
      success: true,
      data: {
        total_students: students,
        total_instructors: instructors,
        total_courses: courses,
        active_sections: sections,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /dashboard/recent-activity?limit=10
router.get('/recent-activity', requireAuth, async (req, res) => {
  try {
    const rawLimit = parseInt(req.query.limit);
    const limit = req.query.limit === 'all' ? 1000 : Math.min(1000, Math.max(1, rawLimit || 10));

    const [recentStudents, recentInstructors, recentCourses, recentEnrollments, recentAttendance] = await Promise.all([
      prisma.students.findMany({
        orderBy: { student_id: 'desc' },
        take: limit,
        select: { student_id: true, first_name_th: true, last_name_th: true, prefix: true, created_at: true },
      }),
      prisma.instructors.findMany({
        orderBy: { created_at: 'desc' },
        take: limit,
        select: { instructor_id: true, first_name_th: true, last_name_th: true, prefix: true, created_at: true },
      }),
      prisma.courses.findMany({
        orderBy: { created_at: 'desc' },
        take: limit,
        select: { course_id: true, course_name_th: true, course_code: true, created_at: true },
      }),
      prisma.enrollments.findMany({
        orderBy: { enrollment_id: 'desc' },
        take: limit,
        include: {
          students: { select: { first_name_th: true, last_name_th: true, prefix: true } },
          class_sections: { select: { section_no: true, courses: { select: { course_name_th: true, course_code: true } } } },
        },
      }),
      prisma.attendance_records.findMany({
        orderBy: { attendance_date: 'desc' },
        take: limit,
        include: {
          students: { select: { first_name_th: true, last_name_th: true } },
          class_sections: { select: { section_no: true, courses: { select: { course_name_th: true } } } },
        },
      }),
    ]);

    const activities = [
      ...recentStudents.map(s => ({
        type: 'student',
        text: `เพิ่มนักศึกษา ${s.prefix || ''}${s.first_name_th} ${s.last_name_th}`,
        time: s.created_at,
        id: s.student_id,
      })),
      ...recentInstructors.map(i => ({
        type: 'instructor',
        text: `เพิ่มอาจารย์ ${i.prefix || ''}${i.first_name_th} ${i.last_name_th}`,
        time: i.created_at,
        id: i.instructor_id,
      })),
      ...recentCourses.map(c => ({
        type: 'course',
        text: `เพิ่มรายวิชา ${c.course_name_th} (${c.course_code})`,
        time: c.created_at,
        id: c.course_id,
      })),
      ...recentEnrollments.map(e => ({
        type: 'enroll',
        text: `${e.students?.prefix || ''}${e.students?.first_name_th || ''} ${e.students?.last_name_th || ''} ลงทะเบียนวิชา ${e.class_sections?.courses?.course_name_th || e.class_sections?.courses?.course_code || ''}`,
        time: e.enroll_date,
        id: e.enrollment_id,
      })),
      ...recentAttendance.map(a => ({
        type: 'attendance',
        text: `เช็คชื่อ ${a.students?.first_name_th || ''} ${a.students?.last_name_th || ''} — ${a.class_sections?.courses?.course_name_th || ''} (${statusTh[a.status] || a.status})`,
        time: a.attendance_date,
        id: a.attendance_id,
      })),
    ]
      .filter(a => a.time)
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, limit);

    return res.json({ success: true, data: activities });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

const statusTh = { present: 'มาเรียน', absent: 'ขาดเรียน', late: 'มาสาย', excused: 'ลา' };

module.exports = router;
