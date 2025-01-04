const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength: 200 }, 
        description: { type: String, maxlength: 500 }, 
        price: { type: Number, required: true },
        size: { type: Number, required: true },
        status: {
            type: String,
            enum: ['available', 'under_review', 'sold', 'rented', 'inactive'],
            default: 'available',
        }, 
        tags: [{ type: String, maxlength: 50 }],
        location: {
            address: { type: String, required: true, maxlength: 200 },
            city: { type: String, required: true, maxlength: 100 },
            state: { type: String, required: true, maxlength: 100 },
            zipCode: { type: String, required: true, maxlength: 20 },
            country: { type: String, required: true, maxlength: 100 },
        },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        sqft: { type: Number, required: true },
        images: [{ type: String }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        versionKey: 'version',
        optimisticConcurrency: true,
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        }
    }
);

module.exports = mongoose.model('Property', propertySchema);
