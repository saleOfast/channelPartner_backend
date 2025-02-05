const fs = require('fs');
const path = require('path');

global.logErrorToFile = function (_error) {
    // const logFilePath = path.join(__dirname, 'errorlog.txt'); // Assuming script.js is in the 'app' folder
    const logFilePath = path.join(__dirname, '..', 'logs', 'errorlog.txt');
    console.log('Log file path:', logFilePath); // Debugging statement
    const _errorMessage = `[${new Date().toISOString()}] ${_error.stack || _error}\n`;
    console.log('Error message:', _errorMessage); // Debugging statement

    fs.appendFile(logFilePath, _errorMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        } else {
            console.log('Error logged successfully.'); // Debugging statement
        }
    });
}

const errorHandlingMiddleware = (err, req, res, next) => {
    logErrorToFile(err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
};

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { logErrorToFile, errorHandlingMiddleware, asyncHandler }