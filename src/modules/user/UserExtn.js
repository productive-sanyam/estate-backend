// models/UserExtn.js
const mongoose = require('mongoose');
const moment = require('moment');

const userExtnSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        profilePic: { type: String, maxlength: 200 },
        viewOwnEntityOnly: { type: Boolean, default: false },
        lastActive: { type: Number }, // store as epoch
        designation: { type: String, maxlength: 100 },
        department: { type: String, maxlength: 100 }
    },
    {
        versionKey: 'version',
        optimisticConcurrency: true,
          timestamps: {
            currentTime: () => moment()
        }
    }
);

module.exports = mongoose.model('UserExtn', userExtnSchema);
