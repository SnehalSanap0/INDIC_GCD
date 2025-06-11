const mongoose = require("mongoose");

// Define the schema for user progress tracking
const ProgressSchema = new mongoose.Schema({
  // ID of the user (can be a string or mongoose.Schema.Types.ObjectId)
  userId: { 
    type: String, 
    required: true 
  },

  // The filename of the level/syllabus (e.g., "swar.json")
  levelFile: { 
    type: String, 
    required: true 
  },

  // Index of the last completed lesson (defaults to 0)
  lastLesson: { 
    type: Number, 
    default: 0 
  }
});

// Export the Progress model to be used in controllers
module.exports = mongoose.model("Progress", ProgressSchema);