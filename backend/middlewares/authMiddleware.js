const jwt = require('jsonwebtoken'); // Imports the 'jsonwebtoken' library for working with JSON Web Tokens.
const User = require('../models/User'); // Imports the User model, likely a Mongoose model for interacting with user data in a MongoDB database.

// Middleware function to require authentication.
// This function checks for a JWT in the request cookies and verifies it.
const requireAuth = (req, res, next) => {
  // Attempt to retrieve the JWT from the 'jwt' cookie in the request.
  const token = req.cookies.jwt;

  // Check if a token exists.
  if (token) {
    // If a token is found, verify it.
    // jwt.verify() takes the token, the secret key (from environment variables for security),
    // and a callback function that handles the verification result.
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      // If there's an error during token verification (e.g., token is invalid, expired).
      if (err) {
        console.error(err); // Log the error for debugging.
        // Send a 401 Unauthorized status with an error message.
        res.status(401).json({ message: "Unauthorized", error: err.message });
      } else {
        // If the token is successfully verified, 'decodedToken' contains the payload.
        try {
          // Find the user in the database using the 'userId' extracted from the decoded token.
          // .lean() is used to get a plain JavaScript object instead of a Mongoose document,
          // which can be faster for read-only operations.
          let user = await User.findById(decodedToken.userId).lean();
          // Attach the fetched user object to the request object.
          // This makes user data available to subsequent middleware or route handlers.
          req.user = user;
          next(); // Call the next middleware function in the stack.
        } catch (dbErr) {
          // If there's a database error during user lookup.
          console.error(dbErr); // Log the database error.
          // Send a 500 Internal Server Error status with a database error message.
          res.status(500).json({ message: "Database error", error: dbErr.message });
        }
      }
    });
  } else {
    // If no token is provided in the cookies.
    // Send a 401 Unauthorized status with a message indicating no token.
    res.status(401).json({ message: "No token provided" });
  }
};

// Export the requireAuth middleware so it can be used in other parts of the application (e.g., route definitions).
module.exports = { requireAuth };