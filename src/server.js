const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./api');

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);

let chefs = [];
let customers = [];

io.on('connection', client => {
  console.log(`new client ${client.id}`);
  client.emit('connection');

  client.on('handshake', id => {});

  client.on('disconnect', () => {
    console.log(`${client.id} disconnected`);
    const sender = findUser(client);
    if (sender === undefined) return;
    const index = users.indexOf(sender);
    users.splice(index, 1);
    findReceivers(users, sender).forEach((item) => {
      item.socket.emit('system', {message: `Пользователь ${sender.name} вышел из чата`});
      item.socket.emit('system', {message: `Теперь в чате ${users.length} пользователей`});
    });
  });
});

const start = (port) =>
{
  port = port || 8000;

  app.use(function (req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
  });

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