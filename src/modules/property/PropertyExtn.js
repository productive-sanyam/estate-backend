const mongoose = require('mongoose');

const propertyExtnSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // Link to Property ID
        notes: { type: String, maxlength: 1000 }, // Notes about the property
        documents: [{ type: String }], // URLs for associated documents
        customFields: mongoose.Schema.Types.Mixed, // Flexible object for any additional fields
        lastViewed: { type: Date }, // Timestamp for the last view
    },
    { timestamps: true }
);

module.exports = mongoose.model('PropertyExtn', propertyExtnSchema);
