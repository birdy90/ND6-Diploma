const fs = require('fs');
const express = require('express');
const app = express();

const dataOptions = {encoding: 'utf8'};

const start = (port) =>
{
  port = port || 3000;

  app.use(express.static(__dirname + '/src'));

  app.get(/\/media\/(.*)/, (req, res) => { res.sendfile('./src/static/' + req.params[0]); });
  app.get(/\/static\/(.*)/, (req, res) => { res.sendfile('./src/' + req.params[0]); });
  app.get(/\/services\/(.*)/, (req, res) => { res.sendfile('./src/services/' + req.params[0]); });
  app.get(/\/node_modules\/(.*)/, (req, res) => { res.sendfile('./node_modules/' + req.params[0]); });

  app.get(/\//, (req, res) => {
    res.sendfile('./src/customer/index.html')
  });

  app.get(/\/kitchen/, (req, res) => {
    res.send('Hello, you\'re at kitchen!');
  });

  app.use((err, req, res, next) => {
    res.status(500).send(err.toString());
  });

  app.listen(port);
};

const read = (path) => {
  return new Promise((done, fail) => {
    fs.readFile(path, dataOptions, (err, data) => {
      if (err) {
        fail(err);
      } else {
        done(data);
      }
    });
  });
};

module.exports = {start};