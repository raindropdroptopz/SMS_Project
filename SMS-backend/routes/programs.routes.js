const express = require('express');
const router = express.Router();
const controller = require('../controllers/programs.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

router.get('/', requireAuth, controller.getPrograms);
router.get('/:id', requireAuth, controller.getProgramById);
router.post('/', requireAuth, requireRole('admin'), controller.createProgram);
router.put('/:id', requireAuth, requireRole('admin'), controller.updateProgram);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteProgram);

module.exports = router;
