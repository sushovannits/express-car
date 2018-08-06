'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var carSchema = new _mongoose2.default.Schema({
  model: { type: String, required: true },
  make: { type: String, required: true },
  color: {
    type: String,
    enum: _colors2.default,
    required: true
  }
}, {
  timestamps: true,
  strict: true
});
carSchema.index({
  model: 1,
  make: 1,
  color: 1
}, { unique: true });

var Car = _mongoose2.default.model('Car', carSchema);
exports.default = Car;
//# sourceMappingURL=cars.js.map