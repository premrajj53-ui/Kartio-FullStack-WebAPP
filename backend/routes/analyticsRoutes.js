const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddlewere');
const {getAdminStats} = require('../controller/analyticsController');
router.get('/', protect, admin, getAdminStats);

module.exports = router;