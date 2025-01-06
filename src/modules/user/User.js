const mongoose = require('mongoose');
const addressSchema = require('../../models/AddressSchema');
const moment = require('moment');

const phoneSchema = new mongoose.Schema(
    {
        countryCode: { type: Number, required: true, default: 91 },
        phone: { type: Number, required: true }
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
        versionKey: 'version',
        optimisticConcurrency: true,
        timestamps: {
            currentTime: () => moment()
        }
    }
);

module.exports = mongoose.model('User', userSchema);
