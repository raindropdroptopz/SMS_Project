const express = require('express');
const router = express.Router();
const controller = require('../controllers/class-sections.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

router.get('/', requireAuth, controller.getSections);
router.get('/:id', requireAuth, controller.getSectionById);
router.post('/', requireAuth, requireRole('admin', 'staff'), controller.createSection);
router.put('/:id', requireAuth, requireRole('admin', 'staff'), controller.updateSection);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteSection);

module.exports = router;
