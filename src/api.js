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

  /* gets user info */
  app.get(`${apiPrefix}/user/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  /* updates user info */
  app.post(`${apiPrefix}/user`, (req, res) => {
    connect('orders')
      .then(collection => collection.insert(req.body.user))
      .then(() => res.send({answer: 'ok'}));
  });

  // money

  /* get user's money */
  app.get(`${apiPrefix}/money/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  /* updates user's money */
  app.post(`${apiPrefix}/money/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.update({email: req.params.email}, {$set: {money: req.body.money}}))
      .then(data => res.send({answer: 'ok'}));
  });

  // chef orders

  /* get all orders of specified status */
  app.get(`${apiPrefix}/chef/orders/:status`, (req, res) => {
    connect('orders')
      .then(collection => collection.aggregate([
        {$unwind: {path: '$orders', includeArrayIndex: 'index'}},
        {$match: {'orders.status.id': {$eq: parseInt(req.params.status)}}},
      ]).toArray())
      .then(data => res.send({answer: data}));
  });

  /* update status of an order */
  app.post(`${apiPrefix}/chef/orders/:status`, (req, res) => {
    let data = {
      [`orders.${req.body.index}.status.id`]: parseInt(req.params.status),
      [`orders.${req.body.index}.status.title`]: req.body.statusName};
    req.body.additional.forEach(item => {
      data = Object.assign(data, {[`orders.${req.body.index}.${item[0]}`]: item[1]});
    });
    connect('orders')
      .then(collection => collection.update({_id: mongodb.ObjectId(req.body.id)}, {$set: data}))
      .then(data => res.send({answer: data}));
  });

  // orders

  /* get all users's orders */
  app.get(`${apiPrefix}/orders/:email`, (req, res) => {
    connect('orders')
      .then(collection => collection.find({email: req.params.email}).toArray())
      .then(data => res.send({answer: data}));
  });

  /* add an order */
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

  /* delete order */
  app.delete(`${apiPrefix}/orders`, (req, res) => {
    connect('orders')
      .then(collection => collection.update(
        {email: req.body.user.email},
        {$pull: {orders: req.body.order}}
        )
      )
      .then(() => res.send({answer: 'ok'}))
  });
};

module.exports = {
  prefix: apiPrefix,
  register: registerApi
};