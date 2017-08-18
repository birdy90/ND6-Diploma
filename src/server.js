const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./api');
const drones = require('netology-fake-drone-api');

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);

let chefs = [];
let customers = [];

const findUser = (collection, client) => collection.find((item) => item.id === client.id);
const tryRemoveUser = (collection, client) => {
  const sender = findUser(collection, client);
  if (sender === undefined) return false;
  const index = collection.indexOf(sender);
  collection.splice(index, 1);
  return true;
};

io.on('connection', client => {

  /* common messages */

  client.on('handshake', data => {
    switch (data.type) {
      case 'chef':
        chefs.push({id: client.id, email: data.email, socket: client});
        console.log(`here is new chef`);
        break;
      case 'customer':
        customers.push({id: client.id, email: data.email, socket: client});
        console.log(`here is ${data.email}`);
        break;
    }
    console.log(`${chefs.length} chefs and ${customers.length} customers`);
  });

  client.on('disconnect', () => {
    if (!tryRemoveUser(customers, client)) {
      tryRemoveUser(chefs, client);
    }
  });

  /* from customers */

  client.on('newOrder', data => {
    chefs.map(t => t.socket.emit('newOrder'));
    const current = findUser(customers, client);
    const sessions = customers.filter((item) => item.email === current.email && item.id !== current.id);
    sessions.forEach(item => item.socket.emit('refreshOrders'));
    sessions.forEach(item => item.socket.emit('refreshMoney'));
  });

  client.on('addMoney', () => {
    const current = findUser(customers, client);
    const sessions = customers.filter((item) => item.email === current.email && item.id !== current.id);
    sessions.forEach(item => item.socket.emit('refreshMoney'));
  });

  /* from chefs */

  client.on('chefUpdatedStatus', data => {
    const sessions = customers.filter((item) => item.email === data.email);
    sessions.forEach(item => item.socket.emit('refreshOrders'));
  });

  client.on('startDelivery', data => {
    const sessions = customers.filter((item) => item.email === data.email);
    sessions.forEach(item => item.socket.emit('refreshOrders'));

    drones.deliver(data.user, data.orders)
      .then(response => client.emit('deliverySuccessfull', data.user))
      .catch(response => client.emit('deliveryFailed', data.user));
  })
});

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

  server.listen(port);
};

const handleStaticRoutes = () => {
  const requestPaths = [
    {in: 'media', out: './src/static/'},
    {in: 'static', out: './src/'},
    {in: 'services', out: './src/services/'},
    {in: 'node_modules', out: './node_modules/'},
  ];
  requestPaths.forEach((item) => {
    const re = new RegExp(`/${item.in}/(.*)`, 'i');
    app.get(re, (req, res) => { res.sendfile(item.out + req.params[0]); });
  });
};

const handleClientApps = () => {
  app.get(/^\/$/i, (req, res) => {
    res.sendfile('./src/customer/index.html')
  });

  app.get(/^\/kitchen(\/)?$/i, (req, res) => {
    res.sendfile('./src/chef/index.html')
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