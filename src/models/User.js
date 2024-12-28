const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    countryCode: { type: Number, required: true, default: 91 },
    phone: { type: Number, required: true },
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 100 },
        email: { type: String, required: true, unique: true, maxlength: 100 },
        password: { type: String, required: true }, // Hashed password
        phoneNo: phoneSchema,
        address: { type: String, maxlength: 200 },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Reference to Role
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
