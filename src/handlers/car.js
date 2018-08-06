import mongoose from 'mongoose';
import Lamlog from 'lamlog';
import Car from '../models/cars';
import {
  createResponse,
  handleMongooseError,
} from './utils';

const logger = new Lamlog({
  name: 'app',
  level: process.env.NODE_ENV === 'dev'
    ? 'debug'
    : 'error',
});

// TODO: Use a util/createResponse function
// TDOD: Use req.json

export async function getCars(req, res) {
  const perPage = 10; // TODO: Make it configurable
  let page = parseInt(req.query.page, 10);
  if (Number.isNaN(page)) {
    page = 0;
  }
  try {
    // TODO: Decide if we want to show information like page id is oyt of range
    const query = Car.find();
    const queryArray = [];
    const validFields = Object.keys(Car.schema.paths);
    logger.debug(req.query);
    Object.keys(req.query || {}).forEach((criteria) => {
      if (validFields.find(field => criteria === field)) {
        const arrValues = req.query[criteria] instanceof Array
          ? req.query[criteria]
          : [req.query[criteria]];
        queryArray.push({
          [criteria]: {
            $in: arrValues,
          },
        });
      }
    });
    if (queryArray.length > 0) {
      query.and(queryArray);
    }
    await query
      .skip(Math.max((perPage * page), 0))
      .limit(perPage)
      .exec()
      .then((allCars) => {
        if (allCars && allCars.length === 0) {
          return createResponse(res, 404, 'Items not found');
        }
        return createResponse(res, 200, null, 'Cars retrieved', {
          count: allCars.length,
          page,
          items: allCars,
        });
      });
  } catch (err) {
    logger.debug(err);
    const { statusCode = 500, errorMsg = 'Could not retrieve cars' } = handleMongooseError(err);
    createResponse(res, statusCode, errorMsg);
  }
}

export function createCar(req, res) {
  const car = new Car();
  car.make = req.body.make;
  car.model = req.body.model;
  car.color = req.body.color;
  car.save().then((newCar) => {
    createResponse(res, 201, null, 'Car created', newCar);
  }).catch((err) => {
    const { statusCode = 500, errorMsg = 'Could not create car' } = handleMongooseError(err);
    createResponse(res, statusCode, errorMsg);
  });
}

// Functions on a existing item car
// These handlers will be for route /car/:carId
// A middleware will populate the car by default

export function findPopulateCarById(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return createResponse(res, 400, 'Not a valid id');
  }
  return Car.findById(req.params.id)
    .then((car) => {
      if (!car) {
        return createResponse(res, 404, 'Item not found');
      }
      req.car = car;
      return next();
    })
    .catch((err) => {
      const { statusCode = 500, errorMsg = 'Could not retrieve car' } = handleMongooseError(err);
      return createResponse(res, statusCode, errorMsg);
    });
}

export function getCar(req, res) {
  createResponse(res, 200, null, 'Item found', req.car);
}

export function putCar(req, res) {
  req.car.make = req.body.make;
  req.car.model = req.body.model;
  req.car.color = req.body.color;
  req.car.save().then((newCar) => {
    createResponse(res, 202, null, 'Car updated', newCar);
  }).catch((err) => {
    const { statusCode = 500, errorMsg = 'Car could not be updated' } = handleMongooseError(err);
    createResponse(res, statusCode, errorMsg);
  });
}

export function patchCar(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Object.keys(req.body).forEach((prop) => {
    req.car[prop] = req.body[prop];
  });
  req.car.save()
    .then((newCar) => {
      createResponse(res, 202, null, 'Car modified', newCar);
    })
    .catch((err) => {
      const { statusCode = 500, errorMsg = 'Car could not be modified' } = handleMongooseError(err);
      createResponse(res, statusCode, errorMsg);
    });
}

export function deleteCar(req, res) {
  req.car.remove().then(() => {
    createResponse(res, 202, null, 'Car deleted');
  }).catch((err) => {
    const { statusCode = 500, errorMsg = 'Car could not be deleted' } = handleMongooseError(err);
    createResponse(res, statusCode, errorMsg);
  });
}
