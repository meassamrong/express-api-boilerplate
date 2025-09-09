const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');
const config = require('../core/app_config.json');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../temp/logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define colors for log levels
const customColors = {
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    debug: 'green',
};

// Add colors to Winston
winston.addColors(customColors);

// Configure daily rotation
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compress old logs
    maxSize: config.app.logger_max_file_size, // Max log file size before creating a new one
    maxFiles: config.app.logger_keep_day, // Keep logs for 7 days
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
});

const isLoggingEnabled = config.app.enable_logger;

// Initialize logger only if enabled
const logger = isLoggingEnabled
    ? winston.createLogger({
          level: 'info',
          format: winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              winston.format.printf(({ timestamp, level, message }) => {
                  return `[${timestamp}] ${level}: ${message}`;
              })
          ),
          transports: [new winston.transports.Console(), dailyRotateFileTransport],
      })
    : {
          info: () => {},
          warn: () => {},
          error: () => {},
          debug: () => {},
      };

module.exports = logger;
