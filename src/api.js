const mongodb = require('mongodb');

const dbUrl = 'mongodb://localhost:27017/TheRestarauntAtTheEndOfTheUniverse';
const apiPrefix = '/api';

const connect = (collection) => new Promise((done, fail) => {
  mongodb.MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
      fail(err);
    }
    const users = db.collection(collection);
    done(users);
  });
});

const registerApi = app => {

  // user

  app.get(`${apiPrefix}/money/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  // orders

  // app.get(`${apiPrefix}/orders`, (req, res) => {
  //   connect('orders')
  //     .then(collection => collection.find({email: req.query.email}))
  //     .then(data => res.send(data));
  // });

  app.get(`${apiPrefix}/orders/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  app.post(`${apiPrefix}/orders`, (req, res) => {
    connect('orders')
      .then(collection => collection.update(
        {email: req.body.user.email},
        {
          $push: {orders: req.body.item},
          $set: {money: req.body.user.money},
        },
        {upsert: true})
      )
      .then(() => res.send({answer: 'ok'}))
  });
};

module.exports = {
  register: registerApi
};