const router = require('express').Router();
const { jwtAcessTokenVerify } = require('../../middlewares/jwt');
const { validatorErrorHandler } = require('../../middlewares/index');
const { createUserValidator, userLoginValidator } = require('../../validators/user_validator');
const { createUserController, userLoginController } = require('../../controllers/users/user_controller');

// user login
router.post('/login',userLoginValidator, validatorErrorHandler, userLoginController)
// create user
router.post(
    '/create',
    jwtAcessTokenVerify,
    createUserValidator,
    validatorErrorHandler,
    createUserController
);


module.exports = router;
