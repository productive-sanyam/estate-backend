const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema(
    {
        countryCode: { type: Number, required: true, default: 91 },
        phone: { type: Number, required: true }
    },
    { _id: false }
);

const addressSchema = new mongoose.Schema(
    {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pinCode: { type: String },
        street: { type: String },
        buildingNumber: { type: String }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 100 },
        email: { type: String, required: true, unique: true, maxlength: 100 },
        password: { type: String, required: true },

        phoneNo: phoneSchema,
        address: addressSchema,
        roles: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
        ],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        },
        versionKey: 'version'
    }
);

module.exports = mongoose.model('User', userSchema);
