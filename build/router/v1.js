'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require('express');

var express = _interopRequireWildcard(_express);

var _cars = require('../models/cars');

var _cars2 = _interopRequireDefault(_cars);

var _car = require('../handlers/car');

var carHandler = _interopRequireWildcard(_car);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = exports.router = express.Router();

/**
 * Router specific middleware
 */

/**
 * Implement routes
 */

router.route('/cars').get(carHandler.getCars).post(carHandler.createCar);

router.use('/cars/:id', carHandler.findPopulateCarById).route('/cars/:id').get(carHandler.getCar).patch(carHandler.patchCar).put(carHandler.putCar).delete(carHandler.deleteCar);
//# sourceMappingURL=v1.js.map