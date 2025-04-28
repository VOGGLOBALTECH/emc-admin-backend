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

// Temporary registration route for testing
router.post('/register', async (req, res, next) => {
  try {
    const user = await require('../models/User').create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

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