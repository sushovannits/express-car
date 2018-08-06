import mongoose from 'mongoose';
import colors from './colors';

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  make: { type: String, required: true },
  color: {
    type: String,
    enum: colors,
    required: true,
  },
}, {
  timestamps: true,
  strict: true,
});
carSchema.index({
  model: 1,
  make: 1,
  color: 1,
}, { unique: true });

const Car = mongoose.model('Car', carSchema);
export default Car;
