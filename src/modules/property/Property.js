const mongoose = require('mongoose');
const addressSchema = require('../../models/AddressSchema');
const moment = require('moment');

const propertySchema = new mongoose.Schema(
    {
        title: { type: String, maxlength: 200 }, 
        description: { type: String, maxlength: 500 }, 
        price: { type: Number,  },
        size: { type: Number,  },
        status: {
            type: String,
            enum: ['available', 'under_review', 'sold', 'rented', 'inactive'],
            default: 'available',
        }, 
        tags: [{ type: String, maxlength: 50 }],
        visibleToAll: {
            type: Boolean,
            default: false,
        },
        assignedCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
        location: addressSchema,
        bedrooms: { type: Number,  },
        bathrooms: { type: Number,  },
        sqft: { type: Number, required: false },
        images: [{ type: String }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        trafficSources: [{
            source: { type: String, maxlength: 100 },
            count: { type: Number, default: 0 },
        }],
        lastViewed: { type: Date },
    },
    {
        versionKey: 'version',
        optimisticConcurrency: true,
          timestamps: {
            currentTime: () => moment()
        }
    }
);

module.exports = mongoose.model('Property', propertySchema);
