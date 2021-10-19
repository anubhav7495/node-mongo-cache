import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://${host}:${port}`;
app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).send("I am alive and kicking. May the force be with you!!")
});

server.listen(port, () => {
    console.log(runningMessage);
});