// errorHandler middleware function
// This function catches errors that occur during request processing.
exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the full error stack to the console for debugging.
    
    // Send a 500 Internal Server Error response to the client.
    res.status(500).json({ 
        message: 'An unexpected error occurred', // A general message for the user.
        error: err.message, // The specific error message from the error object.
    });
};