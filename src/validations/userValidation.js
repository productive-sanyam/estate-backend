// Example using Joi or similar library
const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().max(200).optional(),
    // ...
});

module.exports = {
    userSchema
};


// // File: validations/userValidations.js
// const Joi = require('joi');

// // For creating/updating main User
// const userSchema = Joi.object({
//     name: Joi.string().max(100).required(),
//     email: Joi.string().email().max(100).required(),
//     password: Joi.string().min(6).required(),
//     phoneNo: Joi.object({
//         countryCode: Joi.number().required(),
//         phone: Joi.number().required()
//     }),
//     address: Joi.string().max(200).optional(),
//     // ... any additional fields
// });

// // For creating/updating UserExtn
// const userExtnSchema = Joi.object({
//     profilePic: Joi.string().max(200).optional(),
//     viewOwnEntityOnly: Joi.boolean().optional(),
//     lastActive: Joi.number().optional(),
//     designation: Joi.string().max(100).optional(),
//     department: Joi.string().max(100).optional(),
//     // ... any additional fields
// });

// module.exports = {
//     userSchema,
//     userExtnSchema
// };
