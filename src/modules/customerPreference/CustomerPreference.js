// modules/customerPreference/CustomerPreference.js
const mongoose = require('mongoose');
const moment = require('moment');

const customerPreferenceSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    preferences: {
        location: { type: String },
        minPrice: { type: Number },
        maxPrice: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        // ... add as many preference fields as you like ...
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: 'version',
    timestamps: {
        currentTime: () => moment()
    }
});

module.exports = mongoose.model('CustomerPreference', customerPreferenceSchema);
