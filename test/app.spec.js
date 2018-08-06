import request from 'supertest';
import server from '../src/server';
import { populateDbMock, dropAll } from '../src/handlers/test/mock-gen';
import mongoose from 'mongoose';
import { expect } from 'chai';

describe('Retrieval of cars', async () => {
  before(async () => {
    await dropAll();
    await populateDbMock({make: 'SUB', color: 'White'}); //inserts 16 items
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
  })
  it('GET cars', async function () {
    const res = await request(server)
      .get('/cars');
    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('count', 'page', 'items');
  });

  it('GET cars/:id', async function() {
    const resGet = await request(server)
      .get('/cars');
    const id = resGet.body.body.items[0]._id;
    const res  = await request(server)
      .get(`/cars/${id}`)
    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('make', 'model', 'color');
    expect(res.body.body._id).to.equal(id);
  });

  it('GET cars?make=&model=', async function() {
    const res = await request(server)
      .get('/cars?make=SUB&color=White')
    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('count', 'page', 'items');
    expect(res.body.body.count).to.equal(10); //Pagination check
    expect(res.body.body.items.length).to.equal(10);
    expect(res.body.body.page).to.equal(0);
  })

  it('GET cars?make=&model= test pagination', async function() {
    const res = await request(server)
      .get('/cars?make=SUB&color=White&page=1')
    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('count', 'page', 'items');
    expect(res.body.body.count).to.equal(6); //Pagination check
    expect(res.body.body.page).to.equal(1);
    expect(res.body.body.items.length).to.equal(6);
  })

  it('GET cars?make=&model= test multiple make criteria', async function() {
    await populateDbMock({
      num : 4,
      make: 'RAM',
      color: 'White'
    }); // Expected to put 4 more items making total count 20
    const res  = await request(server)
      .get('/cars?make=SUB&color=White&make=RAM&page=1')
    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('count', 'page', 'items');
    expect(res.body.body.count).to.equal(10); //Pagination check
    expect(res.body.body.page).to.equal(1);
    expect(res.body.body.items.length).to.equal(10);
  })

  it('GET cars?make=&model= test 404 when page out of range', async function() {
    const res = await request(server)
      .get('/cars?make=SUB&color=White&page=10')

    expect(res.status).to.equal(404);
  })

  it('POST /cars', async function () {
    const res = await request(server)
      .post('/cars')
      .send({
        make : 'TestMake',
        model : 'TestModel',
        color : 'White'
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('model', 'make', 'color');
    expect(res.body.body.make).to.equal('TestMake');
  });

  it('GET /cars/:id test invalid id', async function () {
    const res = await request(server)
      .post('/cars/12345');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.all.keys('err');
  });

  it('POST /cars/ test duplicate items', async function () {
    const res = await request(server)
      .post('/cars')
      .send({
        make : 'Dup-TestMake',
        model : 'Dup-TestModel',
        color : 'White'
      });
    expect(res.status).to.equal(201);
    const repostRes = await request(server)
      .post('/cars')
      .send({
        make : 'Dup-TestMake',
        model : 'Dup-TestModel',
        color : 'White'
      });
    expect(repostRes.status).to.equal(400);
    expect(repostRes.body).to.have.all.keys('err', 'message');
  });

  it('PUT /cars/:id', async function () {
    const resPost = await request(server)
      .post('/cars')
      .send({
        make : 'Put-TestMake',
        model : 'Put-TestModel',
        color : 'White'
      });
    const id = resPost.body.body._id;
    const res = await request(server)
      .put(`/cars/${id}`)
      .send({
        make : 'Put-TestMake-Changed',
        model : 'Put-TestModel-Changed',
        color : 'Brown'
      });
    expect(res.status).to.equal(202);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('model', 'make', 'color');
    expect(res.body.body.make).to.equal('Put-TestMake-Changed');
    const resGet = await request(server)
      .get(`/cars/${id}`);
    expect(resGet.body.body.make).to.equal('Put-TestMake-Changed');
  });

  it('PATCH /cars/:id', async function () {
    const resPost = await request(server)
      .post('/cars')
      .send({
        make : 'Patch-TestMake',
        model : 'Patch-TestModel',
        color : 'White'
      });
    const id = resPost.body.body._id;
    const res = await request(server)
      .patch(`/cars/${id}`)
      .send({
        make : 'Patch-TestMake-Modified',
      });
    expect(res.status).to.equal(202);
    expect(res.body).to.include.keys('body', 'message');
    expect(res.body.body).to.include.keys('model', 'make', 'color');
    expect(res.body.body.make).to.equal('Patch-TestMake-Modified');
    const resGet = await request(server)
      .get(`/cars/${id}`);
    expect(resGet.body.body.make).to.equal('Patch-TestMake-Modified');
  });

  it('DELETE /cars/:id', async function () {
    const resPost = await request(server)
      .post('/cars')
      .send({
        make : 'Delete-TestMake',
        model : 'Delete-TestModel',
        color : 'White'
      });
    const id = resPost.body.body._id;
    const res = await request(server)
      .delete(`/cars/${id}`);
    expect(res.status).to.equal(202);
    expect(res.body).to.have.all.keys('message');
    expect(res.body.message).to.equal('Car deleted');
    const resGet = await request(server)
      .get(`/cars/${id}`);
    expect(resGet.status).to.equal(404);
  });


});