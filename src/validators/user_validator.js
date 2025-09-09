const { checkSchema } = require('express-validator');
const { ifEmailExist } = require('../common/user');
// user login validator
const userLoginValidator = checkSchema({
    email: {
        in: ['body'],
        notEmpty: { errorMessage: 'Please provide user email address!' },
        isEmail: { errorMessage: 'Invalid email address!' },
    },
    password: {
        in: ['body'],
        notEmpty: {errorMessage: "Pleas provide user password!"},
        isLength: {
            options: {
                min: 6,
                max: 100
            },
            errorMessage: 'Password must be letter and number minimun 6 and miximun 100',
        }
    }
});
// create user validator
const createUserValidator = checkSchema({
    first_name: {
        in: ['body'],
        notEmpty: { errorMessage: 'First name is required!' },
        isLength: {
            options: {
                min: 1,
                max: 100,
            },
            errorMessage: 'First name character must be minimun 1 and maxinum 100',
        },
    },
    last_name: {
        in: ['body'],
        notEmpty: { errorMessage: 'Last name is required!' },
        isLength: {
            options: {
                min: 1,
                max: 100,
            },
            errorMessage: 'Last name character must be minimun 1 and maxinum 100',
        },
    },
    email: {
        in: ['body'],
        notEmpty: { errorMessage: 'email is required!' },
        isEmail: { errorMessage: 'Please provide the valid email address.' },
        options: {
            custom: async (value) => {
                const user = await ifEmailExist(value);
                if (user) {
                    throw new Error('Email already used!');
                }
                return true;
            },
        },
    },
    password: {
        in: ['body'],
        notEmpty: { errorMessage: 'Password is required!' },
        isLength: {
            options: {
                min: 6,
                max: 100,
            },
            errorMessage: 'Password must be letter and number minimun 6 and miximun 100',
        },
    },
    confirmPassword: {
        in: ['body'],
        notEmpty: {
            options: {
                min: 6,
                max: 100,
            },
            errorMessage: 'Confirn password must be letter and number minimun 6 and miximun 100',
        },
        options: {
            custom: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password and Confirm password not matched!');
                }
            },
        },
    },
    image: {
        in: ['body'],
        optional: true,
        isMongoId: { errorMessage: 'image is must be valid id' },
    },
});

module.exports = { createUserValidator, userLoginValidator };
