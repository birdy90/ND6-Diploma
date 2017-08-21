const request = require('request');

const deleteReadyTimeout = 2 * 60 * 1000;

const findReadyOrders = (api, port, callback) => {
  [4, 5].forEach(index => {
    let data = '';
    request
      .get(`http://localhost:${port}${api.prefix}/chef/orders/${index}`)
      .on('data', chunk => data += chunk.toString())
      .on('end', () => {
        data = JSON.parse(data);
        data.answer.forEach(item => {
          setTimeout(() => {
            request
              .delete(`http://localhost:${port}${api.prefix}/orders`)
              .json({user: item, order: item.orders})
              .on('end', () => {
                if (callback) {
                  callback(item.email);
                }
              });
          }, deleteReadyTimeout);
        });
      });
  });
};

const deteleOrderWithTimeout = (api, port, user, order, callback) => {
  setTimeout(() => {
    request
      .delete(`http://localhost:${port}${api.prefix}/orders`)
      .json({user: user, order: order})
      .on('end', () => {
        if (callback) {
          callback(user.email);
        }
      });
  }, deleteReadyTimeout);
};

module.exports = {
  findReadyOrders,
  deteleOrderWithTimeout
};