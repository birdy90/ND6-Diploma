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

  app.get(`${apiPrefix}/user/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  app.post(`${apiPrefix}/user`, (req, res) => {
    connect('orders')
      .then(collection => collection.insert(req.body.user))
      .then(() => res.send({answer: 'ok'}));
  });

  // money

  app.get(`${apiPrefix}/money/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  app.post(`${apiPrefix}/money/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.update({email: req.params.email}, {$set: {money: req.body.money}}))
      .then(data => res.send({answer: 'ok'}));
  });

  // chef orders

  app.get(`${apiPrefix}/chef/orders/:status`, (req, res) => {
    connect('orders')
      .then(collection => collection.aggregate([
        {$unwind: {path: '$orders', includeArrayIndex: 'index'}},
        {$match: {'orders.status.id': {$eq: parseInt(req.params.status)}}},
      ]).toArray())
      .then(data => res.send({answer: data}));
  });

  app.post(`${apiPrefix}/chef/orders/:status`, (req, res) => {
    connect('orders')
      .then(collection => collection.update({_id: mongodb.ObjectId(req.body.id)},
        {$set: {
          [`orders.${req.body.index}.status`]: {id: parseInt(req.params.status), title: req.body.statusName},
          [`orders.${req.body.index}.startCooking`]: parseFloat(req.body.startCooking)
        }}))
      .then(data => res.send({answer: data}));
  });

  // orders

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