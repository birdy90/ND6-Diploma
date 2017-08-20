const start = (server) => {
  const drones = require('netology-fake-drone-api');
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
    client.on('handshake', handshake);
    client.on('disconnect', disconnect);

    /* from customers */

    client.on('newOrder', newOrder);
    client.on('cancelOrder', cancelOrder);
    client.on('addMoney', addMoney);

    /* from chefs */

    client.on('chefUpdatedStatus', chefUpdatedStatus);
    client.on('startDelivery', startDelivery);

    /* handlers */

    function handshake(data) {
      switch (data.type) {
        case 'chef':
          chefs.push({id: client.id, email: data.email, socket: client});
          break;
        case 'customer':
          customers.push({id: client.id, email: data.email, socket: client});
          break;
      }
    }

    function disconnect() {
      if (!tryRemoveUser(customers, client)) {
        tryRemoveUser(chefs, client);
      }
    }

    function newOrder(data) {
      chefs.forEach(t => t.socket.emit('newOrder'));
      const current = findUser(customers, client);
      const sessions = customers.filter((item) => item.email === current.email && item.id !== current.id);
      sessions.forEach(item => item.socket.emit('refreshOrders'));
      sessions.forEach(item => item.socket.emit('refreshMoney'));
    }

    function cancelOrder(data) {
      const current = findUser(customers, client);
      const sessions = customers.filter((item) => item.email === current.email && item.id !== current.id);
      sessions.forEach(item => item.socket.emit('refreshOrders'));
      sessions.forEach(item => item.socket.emit('refreshMoney'));
    }

    function addMoney() {
      const current = findUser(customers, client);
      const sessions = customers.filter((item) => item.email === current.email && item.id !== current.id);
      sessions.forEach(item => item.socket.emit('refreshMoney'));
    }

    function chefUpdatedStatus(data) {
      const sessions = customers.filter((item) => item.email === data.email);
      sessions.forEach(item => item.socket.emit('refreshOrders'));
    }

    function startDelivery(data) {
      const sessions = customers.filter((item) => item.email === data.email);
      sessions.forEach(item => item.socket.emit('refreshOrders'));

      drones.deliver(data.user, data.orders)
        .then(response => {
          return client.emit('deliverySuccessfull', data.user)
        })
        .catch(response => {
          return client.emit('deliveryFailed', data.user)
        });
    }
  });
};

module.exports = start;