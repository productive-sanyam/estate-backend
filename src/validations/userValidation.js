// File: validations/userValidations.js

const Joi = require('joi');

// Schema for creating/updating User
const userSchema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).required(),
    phoneNo: Joi.object({
        countryCode: Joi.number().required(),
        phone: Joi.number().required(),
    }).required(),
    address: Joi.string().max(200).optional(),
});

module.exports = {
    userSchema
};
