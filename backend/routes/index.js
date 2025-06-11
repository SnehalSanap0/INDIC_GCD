const express = require('express');
const router = express.Router();

// Import modular route files
const authRoutes = require('./authRoutes');
const progressRoutes = require('./progress'); // Handles progress tracking routes

// Route prefix: /api/auth => all authentication-related routes
router.use('/auth', authRoutes);

// Route prefix: /api/progress => all lesson progress routes
router.use('/progress', progressRoutes);

// Future expansion example:
// const otherRoutes = require('./otherRoutes');
// router.use('/other', otherRoutes);

module.exports = router;