const express = require("express");
const router = express.Router();

// Import controller functions
const authController = require("../controllers/authController");

// Middleware to protect routes
const { requireAuth } = require("../middlewares/authMiddleware");

// ---------------------------
// Public Routes (No Auth Required)
// ---------------------------

// Signup route - handles user registration
router.post("/signup", authController.signup);

// Login route - authenticates user and sets JWT cookie
router.post("/login", authController.login);

// ---------------------------
// Protected Routes (Require Auth Token)
// ---------------------------

// Get current authenticated user
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({ user: req.user });
});

// ---------------------------
// Logout Route
// ---------------------------

// Logout the user by clearing the cookie
router.get("/logout", authController.logout);

module.exports = router;