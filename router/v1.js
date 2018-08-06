import * as express from 'express';
import Car from '../models/cars';
import * as carHandler from '../handlers/car';

export const router = express.Router();

/**
 * Router specific middleware
 */

/**
 * Implement routes
 */

router
  .route('/cars')
  .get(carHandler.getCars)
  .post(carHandler.createCar);

router
  .use('/cars/:id', carHandler.findPopulateCarById)
  .route('/cars/:id')
  .get(carHandler.getCar)
  .patch(carHandler.patchCar)
  .put(carHandler.putCar)
  .delete(carHandler.deleteCar);
