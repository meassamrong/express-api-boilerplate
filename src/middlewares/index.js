const { validationResult } = require('express-validator');

// json payload error handler
const jsonErrorHandler = async (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: true,
            message: 'Invalid JSON: Check your request body for syntax errors',
        });
    }
    next();
};

// express validator error handler
const validatorErrorHandler = async (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
    } else {
        return res.status(422).json({ error: true, details: result.array() });
    }
};

module.exports = { jsonErrorHandler, validatorErrorHandler };
