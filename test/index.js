const main = require('../');
const supertest = require('supertest');
const expect = require('chai').expect;
const assert = require('mocha').assert;
const mongodb = require('mongodb');

const dbUrl = 'mongodb://localhost:27017/TheRestarauntAtTheEndOfTheUniverse';
const connect = (collection) => new Promise((done, fail) => {
  mongodb.MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
      fail(err);
    }
    const users = db.collection(collection);
    done(users);
  });
});

describe('api tests', () => {
  let server;
  let testUser = {
    name: 'Test User',
    email: 'test@example.com',
    money: 120,
  };

  before((done) => {
    connect('orders')
      .then(collection => collection.update({email: testUser.email}, {$set: testUser}, {upsert: true}))
      .catch(err => console.log(err));

    server = supertest.agent('http://localhost:8000');
    done();
  });

  it('get user', (done) => {
    server
      .get(`/api/user/${testUser.email}`)
      .expect(200)
      .end((err, response) => {
        if (err) throw err;
        expect(response.body.answer.length).to.be.equal(1);
        expect(response.body.answer[0].name).to.be.equal(testUser.name);
        expect(response.body.answer[0].email).to.be.equal(testUser.email);
        expect(response.body.answer[0].money).to.be.equal(testUser.money);
        done();
      });
  });

  it('get money for user', (done) => {
    server
      .get(`/api/money/${testUser.email}`)
      .expect(200)
      .end((err, response) => {
        if (err) throw err;
        expect(response.body.answer.length).to.be.equal(1);
        expect(response.body.answer[0].money).to.be.equal(testUser.money);
        done();
      });
  });
});