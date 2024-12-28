const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, maxlength: 100 },
        rights: [{ type: Number, required: true }], // Array of permission codes
        forCpanel: { type: Boolean, default: false }, // Whether the role is for control panel users
    },
    { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
