const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Facility = require('../models/Facility');
const AccessLog = require('../models/AccessLog');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res, next) => {
     console.log('Login route hit');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || user.role !== 'admin') {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users by role
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const role = req.query.role;

    let query = {};
    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip(startIndex)
      .limit(limit)
      .select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return next(new ErrorResponse('Invalid status value', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all facilities
// @route   GET /api/admin/facilities
// @access  Private/Admin
exports.getFacilities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.approvalStatus = status;
    }

    const total = await Facility.countDocuments(query);
    const facilities = await Facility.find(query)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: facilities.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: facilities
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update facility status
// @route   PATCH /api/admin/facilities/:id/status
// @access  Private/Admin
exports.updateFacilityStatus = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body;

    if (!['pending', 'approved', 'suspended'].includes(approvalStatus)) {
      return next(new ErrorResponse('Invalid status value', 400));
    }

    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true, runValidators: true }
    );

    if (!facility) {
      return next(new ErrorResponse('Facility not found', 404));
    }

    res.status(200).json({
      success: true,
      data: facility
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get access logs
// @route   GET /api/admin/access-logs
// @access  Private/Admin
exports.getAccessLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const { role, patientId, startDate, endDate } = req.query;

    let query = {};
    if (role) query.role = role;
    if (patientId) query.patientId = patientId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const total = await AccessLog.countDocuments(query);
    const logs = await AccessLog.find(query)
      .populate('userId', 'name email role')
      .populate('patientId', 'name')
      .skip(startIndex)
      .limit(limit)
      .sort('-timestamp');

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (err) {
    next(err);
  }
}; 