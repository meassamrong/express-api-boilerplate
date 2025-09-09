const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');

// access token sign
const jwtAccessTokenSign = (signature) => {
    const token = jwt.sign(signature, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED,
        issuer: process.env.API_ISSUER,
        audience: process.env.AUDIENCE,
    });
    return token;
};

// access token verify
const jwtAcessTokenVerify = asyncHandler(async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({
                error: true,
                message: 'Access Denied!',
            });
        }
        token = token.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err)
                return res.status(403).json({
                    error: true,
                    message: 'Invalid access token',
                });
            req.user_decode = decode;
            next();
        });
    } catch (err) {
        logger.error(`[JWT-ACCESS-VERIFY-ERROR] >>> ${err.message}`);
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error!',
        });
    }
});

// refresh token sign
const jwtRefreshTokenSign = (signature) => {
    const token = jwt.sign(signature, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
        issuer: process.env.API_ISSUER,
        audience: process.env.AUDIENCE,
    });
    return token;
};

// refresh token verify
const jwtRefreshTokenVerify = (token) => {
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decod) => {
        if (err) return false;
        return decod;
    });
};

module.exports = {
    jwtAccessTokenSign,
    jwtAcessTokenVerify,
    jwtRefreshTokenSign,
    jwtRefreshTokenVerify,
};
