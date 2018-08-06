'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropAll = exports.populateDbMock = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var populateDbMock = exports.populateDbMock = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
    var _ref$num = _ref.num,
        num = _ref$num === undefined ? 20 : _ref$num,
        model = _ref.model,
        make = _ref.make,
        color = _ref.color;
    var carArr, i, makeGen, modelGen, colorGen, makerModelArr;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            carArr = [];

            for (i = 0; i < num; i++) {
              makeGen = void 0, modelGen = void 0, colorGen = void 0;

              if (model || make || color) {
                // If nay of these are specified then we only randomize the maker
                // For other fields we just keep iterating through the arrays
                makeGen = make || _faker2.default.helpers.randomize(makerArr);
                colorGen = color || _colors2.default[i % _colors2.default.length];
                makerModelArr = makeToModelMap[makeGen];

                modelGen = model || makerModelArr[i % makerModelArr.length];
              } else {
                makeGen = _faker2.default.helpers.randomize(makerArr);
                modelGen = _faker2.default.helpers.randomize(makeToModelMap[makeGen]);
                colorGen = _faker2.default.helpers.randomize(_colors2.default);
              }
              carArr.push({
                make: makeGen,
                model: modelGen,
                color: colorGen
              });
            }
            _context.prev = 2;
            _context.next = 5;
            return _cars2.default.insertMany(carArr, {
              ordered: false
            });

          case 5:
            console.log('Data mocked');
            return _context.abrupt('return', true);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](2);

            if (!(_context.t0 && _context.t0.code === 11000)) {
              _context.next = 13;
              break;
            }

            return _context.abrupt('return', true);

          case 13:
            console.log(_context.t0);
            return _context.abrupt('return', false);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 9]]);
  }));

  return function populateDbMock(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var dropAll = exports.dropAll = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _cars2.default.remove({}).then(function (_) {
              console.log('All removed');
            });

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function dropAll() {
    return _ref3.apply(this, arguments);
  };
}();

exports.generateData = generateData;
exports.getValidRandomCar = getValidRandomCar;
exports.getValidCar = getValidCar;

var _cars = require('../../models/cars');

var _cars2 = _interopRequireDefault(_cars);

var _colors = require('../../models/colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Put it in init function
var carFakeData = JSON.parse(_fs2.default.readFileSync(__dirname + '/car-mock-data.json'));
var makerArr = Object.keys(carFakeData);
var makeToModelMap = carFakeData;

function generateData() {
  var arr = [];
  var content = _fs2.default.readFileSync('./car-mock-data.json');
  var contentParsed = JSON.parse(content);
  contentParsed.forEach(function (maker) {
    arr.push((0, _defineProperty3.default)({}, maker.value, maker.models.map(function (model) {
      return model.title;
    })));
  });

  _fs2.default.writeFileSync('car-data-filter-1.json', JSON.stringify(arr));
}

function getValidRandomCar(num) {
  var retArr = [];
  for (var i = 0; i < num; i++) {
    var car = new _cars2.default();
    car.make = _faker2.default.helpers.randomize(makerArr);
    car.model = _faker2.default.helpers.randomize(makeToModelMap[car.make]);
    car.color = _faker2.default.helpers.randomize(_colors2.default);
    retArr.push(car);
  }
  return retArr;
}

function getValidCar() {
  var car = new _cars2.default();
  car.make = 'Ford';
  car.model = 'Endeavour';
  car.color = 'White';
  return car;
}
//# sourceMappingURL=mock-gen.js.map