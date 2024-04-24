import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'dotenv/config';

const logDir: string = path.resolve('./tmp/logs');
const useFileForLogs: boolean = false;
const loggerLevel = process.env.LOGGER_LEVEL;

const logLevels = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'cyan'
};

const transports = [
    new (winston.transports.Console)({
        level: loggerLevel,
        format: winston.format.combine(
            winston.format.label(),
            winston.format.colorize(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss'
            }),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    }),
    new (winston.transports.File)({
        level: 'debug',
        filename: path.resolve(logDir, `TestAutomation.log`)
    })
];

winston.addColors(logLevels);

const logger = winston.createLogger({
    transports
});

if (useFileForLogs) {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
} else {
    logger.remove(winston.transports.File);
}

logger.info(`Setting log level to '${loggerLevel}'`);

export { logger };
