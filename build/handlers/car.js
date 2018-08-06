'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCars = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// TODO: Use a util/createResponse function
// TDOD: Use req.json

var getCars = exports.getCars = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var perPage, page, query, queryArray, validFields, _handleMongooseError, _handleMongooseError$, statusCode, _handleMongooseError$2, errorMsg;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            perPage = 10; //TODO: Make it configurable

            page = parseInt(req.query.page, 10);

            if (isNaN(page)) {
              page = 0;
            }
            _context.prev = 3;

            // TODO: Decide if we want to show information like page id is oyt of range
            query = _cars2.default.find();
            queryArray = [];
            validFields = Object.keys(_cars2.default.schema.paths);

            console.log(req.query);
            Object.keys(req.query || {}).forEach(function (criteria) {
              if (validFields.find(function (field) {
                return criteria === field;
              })) {
                var arrValues = req.query[criteria] instanceof Array ? req.query[criteria] : [req.query[criteria]];
                queryArray.push((0, _defineProperty3.default)({}, criteria, {
                  $in: arrValues
                }));
              }
            });
            if (queryArray.length > 0) {
              query.and(queryArray);
            }
            _context.next = 12;
            return query.skip(Math.max(perPage * page, 0)).limit(perPage).exec().then(function (allCars) {
              if (allCars && allCars.length === 0) {
                return (0, _utils.createResponse)(res, 404, 'Items not found');
              }
              (0, _utils.createResponse)(res, 200, null, 'Cars retrieved', {
                count: allCars.length,
                page: page,
                items: allCars });
            });

          case 12:
            _context.next = 19;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](3);

            console.log(_context.t0);
            _handleMongooseError = (0, _utils.handleMongooseError)(_context.t0), _handleMongooseError$ = _handleMongooseError.statusCode, statusCode = _handleMongooseError$ === undefined ? 500 : _handleMongooseError$, _handleMongooseError$2 = _handleMongooseError.errorMsg, errorMsg = _handleMongooseError$2 === undefined ? 'Could not retrieve cars' : _handleMongooseError$2;

            (0, _utils.createResponse)(res, statusCode, errorMsg);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 14]]);
  }));

  return function getCars(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.createCar = createCar;
exports.findPopulateCarById = findPopulateCarById;
exports.getCar = getCar;
exports.putCar = putCar;
exports.patchCar = patchCar;
exports.deleteCar = deleteCar;

var _cars = require('../models/cars');

var _cars2 = _interopRequireDefault(_cars);

var _utils = require('./utils');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCar(req, res, next) {
  var car = new _cars2.default();
  car.make = req.body.make;
  car.model = req.body.model;
  car.color = req.body.color;
  car.save().then(function (newCar) {
    (0, _utils.createResponse)(res, 201, null, 'Car created', newCar);
  }).catch(function (err) {
    var _handleMongooseError2 = (0, _utils.handleMongooseError)(err),
        _handleMongooseError3 = _handleMongooseError2.statusCode,
        statusCode = _handleMongooseError3 === undefined ? 500 : _handleMongooseError3,
        _handleMongooseError4 = _handleMongooseError2.errorMsg,
        errorMsg = _handleMongooseError4 === undefined ? 'Could not create car' : _handleMongooseError4;

    (0, _utils.createResponse)(res, statusCode, errorMsg);
  });
}

// Functions on a existing item car
// These handlers will be for route /car/:carId
// A middleware will populate the car by default

function findPopulateCarById(req, res, next) {
  if (!_mongoose2.default.Types.ObjectId.isValid(req.params.id)) {
    return (0, _utils.createResponse)(res, 400, 'Not a valid id');
  }
  _cars2.default.findById(req.params.id).then(function (car) {
    if (!car) {
      return (0, _utils.createResponse)(res, 404, 'Item not found');
    }
    req.car = car;
    next();
  }).catch(function (err) {
    var _handleMongooseError5 = (0, _utils.handleMongooseError)(err),
        _handleMongooseError6 = _handleMongooseError5.statusCode,
        statusCode = _handleMongooseError6 === undefined ? 500 : _handleMongooseError6,
        _handleMongooseError7 = _handleMongooseError5.errorMsg,
        errorMsg = _handleMongooseError7 === undefined ? 'Could not retrieve car' : _handleMongooseError7;

    (0, _utils.createResponse)(res, statusCode, errorMsg);
  });
}

function getCar(req, res) {
  (0, _utils.createResponse)(res, 200, null, 'Item found', req.car);
}

function putCar(req, res, next) {
  req.car.make = req.body.make;
  req.car.model = req.body.model;
  req.car.color = req.body.color;
  req.car.save().then(function (newCar) {
    (0, _utils.createResponse)(res, 202, null, 'Car updated', newCar);
  }).catch(function (err) {
    var _handleMongooseError8 = (0, _utils.handleMongooseError)(err),
        _handleMongooseError9 = _handleMongooseError8.statusCode,
        statusCode = _handleMongooseError9 === undefined ? 500 : _handleMongooseError9,
        _handleMongooseError10 = _handleMongooseError8.errorMsg,
        errorMsg = _handleMongooseError10 === undefined ? 'Car could not be updated' : _handleMongooseError10;

    (0, _utils.createResponse)(res, statusCode, errorMsg);
  });
}

function patchCar(req, res, next) {
  if (req.body.id) {
    delete req.body.id;
  }
  Object.keys(req.body).forEach(function (prop) {
    req.car[prop] = req.body[prop];
  });
  req.car.save().then(function (newCar) {
    (0, _utils.createResponse)(res, 202, null, 'Car modified', newCar);
  }).catch(function (err) {
    var _handleMongooseError11 = (0, _utils.handleMongooseError)(err),
        _handleMongooseError12 = _handleMongooseError11.statusCode,
        statusCode = _handleMongooseError12 === undefined ? 500 : _handleMongooseError12,
        _handleMongooseError13 = _handleMongooseError11.errorMsg,
        errorMsg = _handleMongooseError13 === undefined ? 'Car could not be modified' : _handleMongooseError13;

    (0, _utils.createResponse)(res, statusCode, errorMsg);
  });
}

function deleteCar(req, res, next) {
  req.car.remove().then(function (_) {
    (0, _utils.createResponse)(res, 202, null, 'Car deleted');
  }).catch(function (err) {
    var _handleMongooseError14 = (0, _utils.handleMongooseError)(err),
        _handleMongooseError15 = _handleMongooseError14.statusCode,
        statusCode = _handleMongooseError15 === undefined ? 500 : _handleMongooseError15,
        _handleMongooseError16 = _handleMongooseError14.errorMsg,
        errorMsg = _handleMongooseError16 === undefined ? 'Car could not be deleted' : _handleMongooseError16;

    (0, _utils.createResponse)(res, statusCode, errorMsg);
  });
}
//# sourceMappingURL=car.js.map