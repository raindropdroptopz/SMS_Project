const express = require('express');
const router = express.Router();
const controller = require('../controllers/semesters.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

router.get('/', requireAuth, controller.getSemesters);
router.get('/:id', requireAuth, controller.getSemesterById);
router.post('/', requireAuth, requireRole('admin'), controller.createSemester);
router.put('/:id', requireAuth, requireRole('admin'), controller.updateSemester);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteSemester);

module.exports = router;
