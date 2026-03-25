const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructors.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

router.get('/', requireAuth, controller.getInstructors);
router.get('/:id', requireAuth, controller.getInstructorById);
router.post('/', requireAuth, requireRole('admin'), controller.createInstructor);
router.put('/:id', requireAuth, requireRole('admin', 'staff'), controller.updateInstructor);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteInstructor);

module.exports = router;
