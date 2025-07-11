
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized", error: err.message });
      } else {
        try {
          let user = await User.findById(decodedToken.userId).lean();
          req.user = user;
          next();
        } catch (dbErr) {
          console.error(dbErr);
          res.status(500).json({ message: "Database error", error: dbErr.message });
        }
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { requireAuth };

