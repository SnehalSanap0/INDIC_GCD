const mongoose = require('mongoose');

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        // Attempt to connect using the URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,        // Use the new URL parser
            useUnifiedTopology: true,     // Use the new Server Discovery and Monitoring engine
        });

        // Log success message if connection is established
        console.log('Connected to MongoDB');
    } catch (err) {
        // Log the error and terminate the process with failure code
        console.error('Database connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

// Export the connection function so it can be used in other parts of the application
module.exports = connectDB;