require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const DB_URL = process.env.MONGO_CONNECTION_STRING;
const DB_NAME = process.env.MONGO_DBNAM;

const dbConnect = async () => {
    mongoose.connection.on('connected', () =>
        logger.info('[DB] >>> MONGODB connection established')
    );
    mongoose.connection.on('open', () => logger.info('[DB] >>> MONGODB connection opened'));
    await mongoose.connect(DB_URL, {
        dbName: DB_NAME,
    });
};

module.exports = dbConnect;
