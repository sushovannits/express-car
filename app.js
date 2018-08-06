import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import session from 'express-session';
import router from './router/routes';
import mongoose from 'mongoose';
import ConnectMongo from 'connect-mongo';
import chalk from 'chalk';
import logger from 'morgan';
const MongoStore = ConnectMongo(session);

/**
 * Load configuration: Authentication enable/disable, API keys, etc.
 */
// TODO: Consider moving to one file
dotenv.load({
  path: '.env.config'
});

/**
 * Create the express app
 */
export const app = express();

/**
 * Conect database (MongoDB)
 */
const dbName = process.env.NODE_ENV === 'test'
                ? process.env.DB_NAME_TEST || 'testdb'
                : process.env.DB_NAME;
const mongodbUri = process.env.MONGODB_URI + dbName;
mongoose.connect(mongodbUri, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s Connection error with mongodb. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Configure application
 */
app.set('port', process.env.PORT || 8000);
app.set('baseUrl', process.env.BASE_URL || `http://localhost:${app.get('port')}`);
// TODO:
// compression?
// use of logger?

/**
 * Set uop middlewares
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));

// TODO: 
// Cors enable

/**
 * Set up routes
 */
app.use('/', router);

/**
 * App wide handlers for unsupported and error
 */
app.use(function(req, res, next) {
  console.log(req.status);
    res.status(501).send(JSON.stringify({
      message: 'Oh that is not supported yet'
    }));
});
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});



