const {validationResult } = require('express-validator');

exports.handleValidationErrors = async(req, res, next) => {
    const errors = validationResult(req);
    console.log('errors',errors);
    if (!errors.isEmpty()) {
     
      return res.status(400).json({ errors: errors.array() });
    }
    // do something with param1 and param2
    next();
};