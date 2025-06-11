const mongoose = require('mongoose');

// Define the schema for User collection
const userSchema = new mongoose.Schema({
  // Full name of the user
  fullname: { 
    type: String, 
    required: true 
  },

  // Unique username for login/identification
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Unique email for contact/login
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Hashed password (stored securely)
  password: { 
    type: String, 
    required: true 
  },

  // Age of the user
  age: { 
    type: Number, 
    required: true 
  },

  // User's native language (limited to specific options)
  nativeLanguage: { 
    type: String, 
    enum: ['Hindi', 'English', 'Marathi', 'Other'],
    required: true 
  },

  // Language the user is learning
  learningLanguage: { 
    type: String, 
    enum: ['Hindi', 'English', 'Marathi', 'Other'],
    required: true 
  },

  // Indicates if the user is specially abled
  speciallyAbled: { 
    type: Boolean, 
    default: false,
    required: true 
  }
});

// Create the model using the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in controllers/services
module.exports = User;