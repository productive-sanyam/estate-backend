const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, maxlength: 100 },
        rights: [{ type: Number, required: true }], 
        forCpanel: { type: Boolean, default: false }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
