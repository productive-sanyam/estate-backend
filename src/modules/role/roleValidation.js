const Joi = require('joi');

const roleSchema = Joi.object({
    name: Joi.string().required(),
    accessRights: Joi.array().items(Joi.number()).optional()
    // ...
});

module.exports = { roleSchema };
