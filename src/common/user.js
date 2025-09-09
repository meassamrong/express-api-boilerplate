const userModel = require('../models/user_model');

// check if user email is existed
const ifEmailExist = async (email) => {
    const user = await userModel.findOne({ email });
    if (!user) return false;
    return user;
};

module.exports = { ifEmailExist };
