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
        // ... any other fields
    },
    {
        // Use 10-digit timestamps (seconds since epoch)
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        },
        versionKey: 'version'
    }
);

module.exports = mongoose.model('User', userSchema);
