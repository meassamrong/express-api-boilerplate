require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const config = require('./src/core/app_config.json');
const logger = require('./src/utils/logger');
const { jsonErrorHandler } = require('./src/middlewares/index');
const mongodbConnection = require('./src/databases/mongodb_connection');
const swaggerDocument = YAML.load("./swagger.yaml");

// config define
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
const SESSION_SECRET = process.env.SESSION_SECRET;

// database connections
mongodbConnection().catch((err) => {
    logger.error(`[MONGODB-ERROR] >>> ${err.message}`);
    process.exit(1);
});

// cors config
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    credentials: true,
    exposedHeaders: ['Authorization'],
};

const helmeter = helmet({
    crossOriginResourcePolicy: true,
});

// rate-limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// middleware apply
app.use(cors(corsOptions));
app.use(helmeter);
app.use(limiter);
app.use(compression());
app.use(jsonErrorHandler);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Increase payload size limit 10mb
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase payload size limit 10mb
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// morgan request logger
if (config.app.enable_req_logger) {
    const stream = {
        write: (message) => {
            logger.info(message.trim());
        },
    };
    //app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }))  // Log only 4xx and 5xx responses to console
    app.use(morgan('combined', { stream }));
}

// router 
const userRouter = require('./src/routes/users/auth')
app.use('/api/user', userRouter)
// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start server
server.listen(PORT, () => {
    logger.info(`[APP] >>> server started at port: ${PORT}`);
});
