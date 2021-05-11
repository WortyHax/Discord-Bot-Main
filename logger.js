const winston = require('winston');
const chalk = require('chalk')

function niceDate(date = new Date()) {
    // HH:MM:SS
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = winston.createLogger({
    level: process.env.NODE_ENV == 'production' ? 'info' : 'debug',
    transports: [
        new winston.transports.Console({ // Console log
            format: winston.format.combine(
                winston.format.colorize({
                    colors: {
                        info: "blue"
                    }
                }),
                winston.format.printf((info) => {
                    return `${chalk.white(`[`)}${chalk.gray(niceDate(new Date()))}${chalk.white(`]`)} ${info.level}: ${info.message}`
                })
            )
        }),
        new winston.transports.File({ // Combined log
            format: winston.format.json(),
            filename: process.cwd() + '/storage/logs/combined.log'
        }),
        new winston.transports.File({
            format: winston.format.json(),
            filename: process.cwd() + '/storage/logs/error.log',
            level: 'error'
        })
    ]
})