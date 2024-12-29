// File: models/UserExtn.js

const mongoose = require('mongoose');

const userExtnSchema = new mongoose.Schema(
    {
        // We reference the same _id as the user
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        profilePic: { type: String },
        lastActive: { type: Number }, 
        designation: { type: String, maxlength: 100 },
        department: { type: String, maxlength: 100 },
    },
    {
        timestamps: {
            currentTime: () => Math.floor(Date.now())
        },
        versionKey: 'version',
        _id: false
    }
);

module.exports = mongoose.model('UserExtn', userExtnSchema);
