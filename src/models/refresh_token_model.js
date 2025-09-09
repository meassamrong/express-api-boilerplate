const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('refresh-token', refreshTokenSchema);
