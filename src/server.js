const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./api');

const http = require('http');
const server = http.createServer(app);
const utils = require('./utils');
const socket = require('./sockets');


const start = (port) =>
{
  port = port || 8000;

  // app.use(function (req, res, next) { console.log(`${req.method} ${req.url}`); next(); });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + '/src'));

  handleStaticRoutes();
  handleClientApps();
  handleApi();
  handleErrors();

  app.use(function(req, res, next) {
    res.status(404).send(`404. Страница '${req.url}' не найдена`);
  });

  utils.findReadyOrders(api, port, email => {
    socket.customers().filter(t => t.email === email).forEach(user => user.socket.emit('refreshOrders'));
  });

  socket.start(server, port);
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

const customerHandler = (req, res) => res.sendFile(`${__dirname}/customer/index.html`);
const chefHandler = (req, res) => res.sendFile(`${__dirname}/chef/index.html`);

const handleClientApps = () => {
  app.get(/^\/$/i, customerHandler);
  app.get(/^\/list(\/)?$/i, customerHandler);
  app.get(/^\/kitchen(\/)?$/i, chefHandler);
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