const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Set JWT expiration to 7 days (in seconds)
const maxAge = 7 * 24 * 60 * 60;

// Helper function to create JWT token
const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

// ----------------------------
// User Signup Controller
// ----------------------------
exports.signup = async (req, res) => {
    try {
        // Destructure user input from request body
        const { 
            fullname, 
            username, 
            email, 
            password, 
            age, 
            nativeLanguage, 
            learningLanguage, 
            speciallyAbled 
        } = req.body;

        // Validate minimum password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists. Please choose a different one." });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists. Please choose a different one." });
        }

        // Hash the user's password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({ 
            fullname, 
            username, 
            email, 
            password: hashedPassword,
            age,
            nativeLanguage,
            learningLanguage,
            speciallyAbled
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token for the user
        const token = createToken(newUser._id);

        // Send token as an HTTP-only cookie
        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure flag in production
            maxAge: maxAge * 1000, // Convert to milliseconds
            sameSite: 'lax',
        });

        // Respond with success and basic user info
        res.status(201).json({ 
            message: "User created successfully.", 
            user: { username: newUser.username } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error creating user", 
            error: error.message 
        });
    }
};

// ----------------------------
// User Login Controller
// ----------------------------
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare the entered password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // Create JWT token for the logged-in user
        const token = createToken(user._id);

        // Set token as an HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: maxAge * 1000,
            sameSite: 'strict',
        });

        // Respond with success and basic user info
        res.status(200).json({
            message: "Login successful.",
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            }
        });
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ 
            message: "Error logging in", 
            errorDetails: error.message,
            stack: error.stack 
        });
    }
};

// ----------------------------
// User Logout Controller
// ----------------------------
exports.logout = (req, res) => {
    // Overwrite the JWT cookie to expire immediately
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully." });
};