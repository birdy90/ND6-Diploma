const mongodb = require('mongodb');

const dbUrl = 'mongodb://localhost:27017/TheRestarauntAtTheEndOfTheUniverse';
const apiPrefix = '/api';

const registerApi = app => {
  mongodb.MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
      console.log('Connection error');
    } else {
      let collection = db.collection('orders');

      app.get(`${apiPrefix}/orders`, (req, res) => {
        console.log('get');
      });

      app.post(`${apiPrefix}/orders`, (req, res) => {
        console.log('save');
        console.log(req.body);
        // collection.insertOne({test: 'testets'});
      });
    }
  });
};

module.exports = {
  register: registerApi
};