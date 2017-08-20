const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./api');

const http = require('http');
const server = http.createServer(app);
require('./sockets')(server);

const start = (port) =>
{
  port = port || 8000;

  app.use(function (req, res, next) { console.log(`${req.method} ${req.url}`); next(); });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + '/src'));

  handleStaticRoutes();
  handleClientApps();
  handleApi();
  handleErrors();

  server.listen(port);
};

const handleStaticRoutes = () => {
  const requestPaths = [
    {in: 'media', out: '/src/static/'},
    {in: 'static', out: '/src/'},
    {in: 'services', out: '/src/services/'},
    {in: 'node_modules', out: '/node_modules/'},
  ];
  requestPaths.forEach((item) => {
    const re = new RegExp(`/${item.in}/(.*)`, 'i');
    const dir = __dirname.replace(/[\/\\]src$/, '');
    app.get(re, (req, res) => { res.sendFile(dir + item.out + req.params[0]); });
  });
};

const handleClientApps = () => {
  app.get(/^\/$/i, (req, res) => {
    res.sendFile(`${__dirname}/customer/index.html`)
  });

  app.get(/^\/kitchen(\/)?$/i, (req, res) => {
    res.sendFile(`${__dirname}/chef/index.html`)
  });
};

const handleApi = () => {
  api.register(app);
};

const handleErrors = () => {
  app.use((err, req, res, next) => {
    res.status(500).send(err.toString());
  });
};

module.exports = {start};