const mongoose = require('mongoose');

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

module.exports = addressSchema;