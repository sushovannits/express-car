'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require('./app');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app.app.listen(_app.app.get('port'), function () {
  console.log(_chalk2.default.green('✓') + ' App is listening at ' + _app.app.get('baseUrl') + ' in ' + 'env' + ' mode');
  console.log('Press CTRL-C to stop\n');
});

exports.default = _app.app;
//# sourceMappingURL=server.js.map