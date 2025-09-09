const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const usersSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'images',
        },
        password: {
            type: String,
            minlength: 6,
            maxlength: 100,
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'roles',
            },
        ],
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'inactive'],
        },
        passwordResetRequest: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);
usersSchema.plugin(paginate);
module.exports = mongoose.model('users', usersSchema);
