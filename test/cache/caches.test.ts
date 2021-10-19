import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';

let firstKey = 'test-key-1';
const firstKeyBody = {
  value: 'This is a test key value'
};

let nonExistentKey = 'test-key-doesnt-exist'

describe('cache endpoints', function () {
  let request: supertest.SuperAgentTest;
  before(function () {
      request = supertest.agent(app);
  });
  after(function (done) {
      // shut down the Express.js server, close our MongoDB connection, then
      // tell Mocha we're done:
      app.close(() => {
          mongoose.connection.close(done);
      });
  });

  it('should allow a GET from /caches', async function () {
    const res = await request
        .get(`/caches`)
        .send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length(0);
  });

  it(`should allow a PUT to /caches/:key`, async function () {
    const res = await request.put(`/caches/${firstKey}`).send(firstKeyBody);
  
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it(`should not allow a PUT to /caches/:key with missing body`, async function () {
    const res = await request.put(`/caches/${firstKey}`).send();
  
    expect(res.status).to.equal(400);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors).to.have.length(1);
    expect(res.body.errors[0].msg).to.equal('Invalid value');
  });

  it('should allow a GET from /caches/:key', async function () {
    const res = await request
        .get(`/caches/${nonExistentKey}`)
        .send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.key).to.be.a('string');
    expect(res.body.key).to.equal(nonExistentKey);
  });

  it('should allow a Delete to /caches/:key', async function () {
    const res = await request
        .delete(`/caches/${nonExistentKey}`)
        .send();
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it('should allow a Delete to /caches', async function () {
    const res = await request
        .delete(`/caches`)
        .send();
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });
});