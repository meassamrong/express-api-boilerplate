const rolesModel = require('../models/roles_model');

const getRolesByName = async (rolesName) => {
    const role = await rolesModel.findOne({ name: rolesName });
    if (!role) return false;
    return role;
};

module.exports = { getRolesByName };
