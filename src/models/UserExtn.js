const mongoose = require('mongoose');

const userExtnSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        profilePic: { type: String, maxlength: 200 },
        zones: [{ type: String }], // Zone IDs
        viewOwnEntityOnly: { type: Boolean, default: false },
        lastActive: { type: Date },
        designation: { type: String, maxlength: 100 },
        department: { type: String, maxlength: 100 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('UserExtn', userExtnSchema);
