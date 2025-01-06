// validationSchemas.js (or wherever you store validation)
const Joi = require('joi');

// User extension schema
const userExtnSchema = Joi.object({
    profilePic: Joi.string().max(200).optional(),
    viewOwnEntityOnly: Joi.boolean().optional(),
    lastActive: Joi.number().optional(),
    designation: Joi.string().max(100).optional(),
    department: Joi.string().max(100).optional(),
});

// A combined schema if you want to handle both in one request
const combinedUserSchema = Joi.object({
    // main user fields
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).required(),
    phoneNo: Joi.object({
        countryCode: Joi.number().required(),
        phone: Joi.number().required()
    }),
    userExtn: userExtnSchema.optional(),
});

module.exports = {
    userExtnSchema,
    combinedUserSchema
};
