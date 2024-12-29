// File: models/User.js

const mongoose = require('mongoose');

// Sub-schema for phoneNo (no _id)
const phoneSchema = new mongoose.Schema(
    {
        countryCode: { type: Number, required: true, default: 91 },
        phone: { type: Number, required: true },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 100 },
        email: { type: String, required: true, unique: true, maxlength: 100 },
        password: { type: String, required: true }, // Hashed password
        phoneNo: phoneSchema,
        address: { type: String, maxlength: 200 },
        // Link to role if you need
        // role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        // Replace timestamps with integer time
        timestamps: {
            currentTime: () => Math.floor(Date.now()) // milliseconds since epoch
        },
        versionKey: 'version' // renames __v to version
    }
);

module.exports = mongoose.model('User', userSchema);
