import request from 'supertest';
import 'babel-polyfill';
import server from '../server';
import { populateDbMock } from '../handlers/test/mock-gen';
import mongoose from 'mongoose';
import { expect } from 'chai';

describe('Retrieval of cars', async () => {
  let validCar;
  before(async () => {
    await populateDbMock();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
  })
  it('GET cars', function (done) {
    request(server)
      .get('/cars')
      .end((err, res) => {
        if(err) {
          done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('body', 'message');
        expect(res.body.body).to.include.keys('count', 'page', 'items');
        validCar= res.body.body.items[0];
        done();
      });
  });

  it('GET cars/:id', function (done) {
    request(server)
      .get(`/cars/${validCar._id}`)
      .end((err, res) => {
        if(err) {
          done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('body', 'message');
        expect(res.body.body).to.include.keys('make', 'model', 'color');
        expect(res.body.body).to.deep.equal(validCar);
        done();
      });
  });

  it.skip('POST cars', function (done) {
    request(server)
      .post('/cars')
      .end((err, res) => {
        if(err) {
          done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('body', 'message');
        expect(res.body.body).to.include.keys('count', 'page', 'items');
        done();
      })
    });
});