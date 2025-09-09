const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const rolesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        permission: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);
rolesSchema.plugin(paginate);
module.exports = mongoose.model('roles', rolesSchema);