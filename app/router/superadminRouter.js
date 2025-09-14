// routes/superadmin.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthCheck');
const { roleMiddleware } = require('../middleware/rbac');
const superadminController = require('../controller/SuperadminController');

router.use(verifyToken);
router.use(roleMiddleware(['superadmin']));

router.get('/dashboard', superadminController.getDashboard);

module.exports = router;