const mongoose = require('mongoose');

const propertyExtnSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
        additionalFeatures: [String],
        virtualTourUrl: { type: String, maxlength: 200 },
        floorPlans: [{ type: String, maxlength: 200 }],
        lastViewed: { type: Number }, // store as epoch
        popularityScore: { type: Number, default: 0 }
    },
    {
        versionKey: 'version',
        optimisticConcurrency: true,
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        }
    }
);

module.exports = mongoose.model('PropertyExtn', propertyExtnSchema);