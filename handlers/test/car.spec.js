import { expect } from 'chai';
import sinon from 'sinon';
import { getValidRandomCar } from './mock-gen';
import 'babel-polyfill';
import mongoose from 'mongoose';
import * as carHandler from '../car';
import Car from '../../models/cars';

let req = {};
let res = {};
let send, json, status;

describe('handlers', () => {
  beforeEach(() => {
    req = {};
    send = sinon.stub();
    json = sinon.stub();
    res = {
      status : sinon.stub().returns({
        json, send
      })
    };
    sinon.stub(mongoose.Query.prototype, 'exec');
  });
  afterEach((done) => {
    mongoose.Query.prototype.exec.restore();
    done();
  })

  it('should return all cars' , async () => {
    const expectedModels = getValidRandomCar(2);
    mongoose.Query.prototype.exec.resolves(expectedModels);
    req.query = {};
    await carHandler.getCars(req, res);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(
      json,
      sinon.match({
        body : {
          count: 2,
          page: 0,
          items: expectedModels,
        },
        message: 'Cars retrieved'
      })
    );
  });

  it('should query mongoose with query parameters', async () => {
    const st = sinon.spy(mongoose.Query.prototype, 'and');
    mongoose.Query.prototype.exec.resolves([]);
    req.query = {
      model : 'Ford',
      make : 'Endeavour'
    };
    await carHandler.getCars(req, res);
    sinon.assert.calledWithMatch(
      st,
      [{ model: { '$in': ['Ford'] } }, { make: { '$in': ['Endeavour']}}]
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


});