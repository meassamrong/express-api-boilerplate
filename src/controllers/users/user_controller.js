const userModel = require('../../models/user_model');
const refreshTokenModel = require('../../models/refresh_token_model');
const logger = require('../../utils/logger');
const bcrypt = require('bcryptjs');
const { getRolesByName } = require('../../common/roles');
const { authorizeRoles } = require('../../middlewares/authorize_roles');
const { jwtAccessTokenSign, jwtRefreshTokenSign } = require('../../middlewares/jwt');

// create new user
const createUserController = async (req, res) => {
    try {
        const { first_name, last_name, roles, email, password, image } = req.body;

        // asign user role default role
        let rolesArr = [];
        // check if create user with role
        if (roles) {
            // checck user permision
            authorizeRoles('admin');
            rolesArr.push(roles);
        }
        const defaultRoles = await getRolesByName(process.env.DEFAULT_USER_ROLE);
        if (!defaultRoles) {
            return res.status(422).json({
                error: true,
                message:
                    "Seem the system dons't have default roles! Please read document for create or generate roles.",
            });
        }
        if (defaultRoles) {
            rolesArr.push(defaultRoles._id);
        }

        const hashPassword = bcrypt.hash(password, 10);
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            roles: rolesArr,
            password: hashPassword,
            image,
        });
        const saveUser = await newUser.save();
        if (!saveUser) {
            return res.status(422).json({
                error: true,
                message: 'Failed to creating new user!',
            });
        }
        res.status(201).json({
            error: false,
            message: 'New user successfully created!',
            user: saveUser,
        });
    } catch (err) {
        logger.error(`[CREATE-USER-ERROR] >>> ${err.message}`);
        res.status(500).json({
            error: false,
            message: 'Internal Server Error!',
        });
    }
};

// user login
const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate('roles');
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Incorrect email or password',
            });
        }
        const passwordMatched = bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            return res.status(401).json({
                error: true,
                message: 'Incorrect email or password',
            });
        }

        const accessToken = jwtAccessTokenSign({
            _id: user._id,
            email: user.email,
            roles: user.roles,
        });
        const resfreshToken = jwtRefreshTokenSign({
            _id: user._id,
            email: user.email,
            roles: user.roles,
        });
        const saveNewRefreshToken = new refreshTokenModel({
            token: resfreshToken,
            isActive: true,
        });
        const savedRefreshToken = await saveNewRefreshToken.save();

        res.status(200).json({
            error: false,
            a_token: accessToken,
            r_token: savedRefreshToken.token,
            r_token_id: savedRefreshToken._id,
        });
    } catch (err) {
        logger.error(`[USER-LOGIN-ERROR] >>> ${err.message}`);
    }
};
module.exports = { createUserController, userLoginController };
