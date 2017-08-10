const server = require('./src/server');

let port;

let flag = '';
process.argv.forEach(function (arg) {
  switch (flag) {
    case '-p':
      port = parseInt(arg);
      break;
  }

  flag = '';

  switch (arg) {
    case '-p':
      flag = arg;
      break;
  }
});

server.start(port);