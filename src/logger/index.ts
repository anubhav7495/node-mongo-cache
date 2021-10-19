import * as winston from 'winston';

const logConfiguration: winston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
  ),
};

const logger = winston.createLogger(logConfiguration);

export default logger;