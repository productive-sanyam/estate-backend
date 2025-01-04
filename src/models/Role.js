// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        accessRights: [{ type: Number }],

        // track who created & last updated
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        },
        versionKey: 'version'
    }
);

module.exports = mongoose.model('Role', roleSchema);
