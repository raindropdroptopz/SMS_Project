const express = require('express');
const router = express.Router();
const controller = require('../controllers/courses.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

router.get('/', requireAuth, controller.getCourses);
router.get('/:id', requireAuth, controller.getCourseById);
router.post('/', requireAuth, requireRole('admin', 'staff'), controller.createCourse);
router.put('/:id', requireAuth, requireRole('admin', 'staff'), controller.updateCourse);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteCourse);

module.exports = router;
