const express = require('express');
const router = express.Router();
const controller = require('../controllers/departments.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

router.get('/', requireAuth, controller.getDepartments);
router.get('/:id', requireAuth, controller.getDepartmentById);
router.post('/', requireAuth, requireRole('admin'), controller.createDepartment);
router.put('/:id', requireAuth, requireRole('admin'), controller.updateDepartment);
router.delete('/:id', requireAuth, requireRole('admin'), controller.deleteDepartment);

module.exports = router;
