// middlewares/validateMiddleware.js
const Joi = require('joi');

function validateRequest(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map(d => d.message),
            });
        }
        // Replace req.body with validated/sanitized data
        req.body = value;
        next();
    };
}

module.exports = validateRequest;
