'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _routes = require('./router/routes');

var routes = _interopRequireWildcard(_routes);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _utils = require('./handlers/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);

/**
 * Load configuration: Authentication enable/disable, API keys, etc.
 */
// TODO: Consider moving to one file
_dotenv2.default.load({
  path: '.env.config'
});

/**
 * Create the express app
 */
var app = exports.app = (0, _express2.default)();

/**
 * Conect database (MongoDB)
 */
var dbName = process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST || 'testdb' : process.env.DB_NAME;
var mongodbUri = process.env.MONGODB_URI + dbName;
console.log(mongodbUri);
_mongoose2.default.connect(mongodbUri, { useNewUrlParser: true });
_mongoose2.default.connection.on('error', function (err) {
  console.error(err);
  console.log('%s Connection error with mongodb. Please make sure MongoDB is running.', _chalk2.default.red('✗'));
  process.exit();
});

/**
 * Configure application
 */
app.set('port', process.env.PORT || 8000);
app.set('baseUrl', process.env.BASE_URL || 'http://localhost:' + app.get('port'));
// TODO:
// compression?
// use of logger?

/**
 * Set uop middlewares
 */
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));
app.use((0, _expressValidator2.default)());
app.use((0, _expressSession2.default)({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}));

/**
 *  Cors enable
 */
// TODO: Later implement route specific CORS or dynamic origin. Now allowed for all origin
app.use((0, _cors2.default)());

/**
 * Set up versioning and routes
 */
console.log(routes);
app.use('/', routes.v1);
app.use('/v1/', routes.v1);

/**
 * App wide handlers for unsupported and error
 */
app.use(function (req, res, next) {
  console.log(req.status);
  (0, _utils.createResponse)(res, 501, 'That is not supported yet');
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  (0, _utils.createResponse)(res, 500, 'Something broke! Please raise a ticket');
});
//# sourceMappingURL=app.js.map