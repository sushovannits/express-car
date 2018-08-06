import sinon from 'sinon';
import mongoose from 'mongoose';
import { getValidRandomCar } from './mock-gen';
import * as carHandler from '../car';
import Car from '../../models/cars';
// import Car from '../../models/cars';

let req = {};
let res = {};
let send; let json;

describe('handlers', () => {
  beforeEach(() => {
    req = {};
    send = sinon.stub();
    json = sinon.stub();
    res = {
      status: sinon.stub().returns({
        json, send,
      }),
    };
    sinon.stub(mongoose.Query.prototype, 'exec');
  });
  afterEach((done) => {
    mongoose.Query.prototype.exec.restore();
    done();
  });

  it('should return all cars', async () => {
    const expectedModels = getValidRandomCar(2);
    mongoose.Query.prototype.exec.resolves(expectedModels);
    req.query = {};
    await carHandler.getCars(req, res);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(
      json,
      sinon.match({
        body: {
          count: 2,
          page: 0,
          items: expectedModels,
        },
        message: 'Cars retrieved',
      }),
    );
  });

  it('should query mongoose with query parameters', async () => {
    const st = sinon.spy(mongoose.Query.prototype, 'and');
    mongoose.Query.prototype.exec.resolves([]);
    req.query = {
      model: 'Ford',
      make: 'Endeavour',
    };
    await carHandler.getCars(req, res);
    sinon.assert.calledWithMatch(
      st,
      [{ model: { $in: ['Ford'] } }, { make: { $in: ['Endeavour'] } }],
    );

    // mongoose.Query.prototype.and.restore();
  });

  it('should return a 404 when no cars are returned', async () => {
    mongoose.Query.prototype.exec.resolves([]);
    req.query = {};
    await carHandler.getCars(req, res);
    sinon.assert.calledWith(res.status, 404);
    // mongoose.Query.prototype.exec.restore();
  });

  it('should create a car', async () => {
    const carToMake = {
      make: 'Ford',
      model: 'Star',
      color: 'White',
    };
    sinon.stub(mongoose.Model.prototype, 'save').resolves(carToMake);
    req.body = carToMake;
    await carHandler.createCar(req, res);
    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(json, { body: carToMake, message: 'Car created' });
    mongoose.Model.prototype.save.restore();
  });

  it('should not create a car when body is invalid', async () => {
    const carToMake = {
      make: 'Ford',
      model: 'Star',
    };
    sinon.stub(mongoose.Model.prototype, 'save').rejects({ name: 'ValidationError', message: 'Failed Validation' });
    req.body = carToMake;
    await carHandler.createCar(req, res);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(json, { errorMsg: 'Failed Validation' });
    mongoose.Model.prototype.save.restore();
  });

  it('should find a car by id', async () => {
    const carToMake = {
      make: 'Ford',
      model: 'Star',
      color: 'White',
    };
    const carId = '5b6819b1fd96180012e51b33';
    req.params = {
      id: carId,
    };
    sinon.stub(Car, 'findById').resolves(carToMake);
    const next = sinon.stub();
    await carHandler.findPopulateCarById(req, res, next);
    expect(req).toHaveProperty('car', carToMake);
    sinon.assert.called(next);
    Car.findById.restore();
  });

  it('should not find a car and return 404', async () => {
    const carId = '5b6819b1fd96180012e51b33';
    req.params = {
      id: carId,
    };
    sinon.stub(Car, 'findById').resolves(null);
    const next = sinon.stub();
    await carHandler.findPopulateCarById(req, res, next);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(json, { errorMsg: 'Item not found' });
    sinon.assert.notCalled(next);
    Car.findById.restore();
  });

  it('should not find a car and return 400 for invalid id', async () => {
    const carId = '1234';
    req.params = {
      id: carId,
    };
    const next = sinon.stub();
    await carHandler.findPopulateCarById(req, res, next);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(json, { errorMsg: 'Not a valid id' });
    sinon.assert.notCalled(next);
  });

  it('should return 500 when any other error', async () => {
    const carId = '5b6819b1fd96180012e51b33';
    req.params = {
      id: carId,
    };
    sinon.stub(Car, 'findById').rejects({ name: 'Arbitrary error' });
    const next = sinon.stub();
    await carHandler.findPopulateCarById(req, res, next);
    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(json, { errorMsg: 'Could not retrieve car' });
    sinon.assert.notCalled(next);
    Car.findById.restore();
  });
});
