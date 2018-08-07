import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import session from 'express-session';
import mongoose from 'mongoose';
import ConnectMongo from 'connect-mongo';
import chalk from 'chalk';
import loggerMiddleware from 'morgan';
import cors from 'cors';
import { createLogger } from './handlers/utils';
import routes from './router/routes';
import { createResponse } from './handlers/utils';
import config from './config';

const logger = createLogger();

const MongoStore = ConnectMongo(session);

/**
 * Create the express app
 */
const app = express();

/**
 * Conect database (MongoDB)
 */
const mongodbUri = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
logger.debug(mongodbUri);
mongoose.connect(mongodbUri, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  logger.error(err);
  logger.info('%s Connection error with mongodb. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Configure application
 */
app.set('port', config.app.port);
app.set('baseUrl', config.app.baseUrl);
// TODO:
// compression?
// use of logger?

/**
 * Set uop middlewares
 */
app.use(loggerMiddleware('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: mongodbUri,
    autoReconnect: true,
  }),
}));

/**
 *  Cors enable
 */
// TODO: Later implement route specific CORS or dynamic origin. Now allowed for all origin
app.use(cors());

/**
 * Set up versioning and routes
 */
app.use('/', routes.v1);
app.use('/v1/', routes.v1);

/**
 * App wide handlers for unsupported and error
 */
app.use((req, res) => {
  createResponse(res, 501, 'That is not supported yet');
});
app.use((err, _, res) => {
  logger.error(err.stack);
  createResponse(res, 500, 'Something broke! Please raise a ticket');
});

export default app;
