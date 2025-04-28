const express = require('express');
const {
  login,
  getUsers,
  updateUserStatus,
  getFacilities,
  updateFacilityStatus,
  getAccessLogs
} = require('../controllers/adminController');

const { protect, authorize, checkActive } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route
router.post('/login', login);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));
router.use(checkActive);

router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

router.get('/facilities', getFacilities);
router.patch('/facilities/:id/status', updateFacilityStatus);

router.get('/access-logs', getAccessLogs);

module.exports = router;