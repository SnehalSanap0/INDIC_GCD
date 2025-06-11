const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress"); // Mongoose model for tracking progress

// -----------------------------
// GET /api/progress/:userId/:levelFile
// Fetch the progress of a user for a given level file
// -----------------------------
router.get("/:userId/:levelFile", async (req, res) => {
  try {
    const { userId, levelFile } = req.params;
    console.log(`Fetching progress for User: ${userId}, Level: ${levelFile}`);

    const progress = await Progress.findOne({ userId, levelFile });

    if (progress) {
      console.log("Progress Found:", progress);
      res.json({ lastLesson: progress.lastLesson });
    } else {
      console.log("No progress found, returning default 0.");
      res.json({ lastLesson: 0 }); // Return 0 if no record exists
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -----------------------------
// POST /api/progress
// Create or update progress for a user and level
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const { userId, levelFile, lastLesson } = req.body;

    console.log("Received Progress Update Request:", req.body);

    // Validate required fields
    if (!userId || !levelFile) {
      return res.status(400).json({ error: "Missing userId or levelFile" });
    }

    // Update existing or insert new progress record
    const progress = await Progress.findOneAndUpdate(
      { userId, levelFile },
      { lastLesson },
      { new: true, upsert: true } // `upsert` ensures record is created if it doesn't exist
    );

    console.log("Saved Progress:", progress);
    res.json({ message: "Progress saved successfully", progress });
  } catch (error) {
    console.error("Error saving progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;