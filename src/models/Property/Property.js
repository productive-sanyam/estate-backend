const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength: 200 }, // Property title
        description: { type: String, maxlength: 500 }, // Brief description
        price: { type: Number, required: true }, // Price of the property
        size: { type: Number, required: true }, // Size in sqft or m2
        status: {
            type: String,
            enum: ['available', 'under_review', 'sold', 'rented', 'inactive'],
            default: 'available',
        }, // Property status
        tags: [{ type: String, maxlength: 50 }], // Custom tags (e.g., "luxury", "new")
        location: {
            address: { type: String, required: true, maxlength: 200 },
            city: { type: String, required: true, maxlength: 100 },
            state: { type: String, required: true, maxlength: 100 },
            zipCode: { type: String, required: true, maxlength: 20 },
            country: { type: String, required: true, maxlength: 100 },
        }, // Nested location object
        images: [{ type: String }], // URLs for property images
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned user (Supervisor/Staff)
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Creator of the property
    },
    { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
