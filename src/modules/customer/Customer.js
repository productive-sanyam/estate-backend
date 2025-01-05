// modules/customer/Customer.js
const mongoose = require('mongoose');
const moment = require('moment');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    phone: { type: String, maxlength: 15 },
    requirements: { type: String, maxlength: 500 },
    // Additional fields for lead tracking, etc.
}, {
    versionKey: 'version',
    timestamps: {
        currentTime: () => moment()
    }
});

module.exports = mongoose.model('Customer', customerSchema);
