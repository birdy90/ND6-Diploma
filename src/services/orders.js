customerApp.factory('OrdersService', function($http, $resource, UserService) {
  const statuses = {
    ordered: {id: 1, title: 'Заказано'},
    cooking: {id: 2, title: 'Готовится'},
    delivery: {id: 3, title: 'Доставляется'},
    failed: {id: 4, title: 'Возникли сложности'},
    served: {id: 5, title: 'Подано'},
  };

  const resource = $resource('http://localhost:8000/api/orders/:email', {email: '@email'});

  return {
    db: resource,

    statuses: statuses,
    getOrders: () => new Promise((done, fail) => {
      resource.get({email: UserService.user().email}, data => done(data.answer[0].orders));
    }),
    getMenu: () => new Promise((done, fail) => {
      $http.get('/media/menu.json')
        .then((data) => {
          const menu = data.data;
          const menuParted = chunkify(menu, 3, true);
          done({menu, menuParted});
        });
    }),
    addOrder: (item) => {
      let newItem = {
        orders: item.id,
        startTime: Date.now(),
        endTime: null,
        status: statuses.ordered
      };
      resource.save({
        user: UserService.user(),
        item: newItem
      });
      newItem.title = item.title;
      return newItem;
    }
  }
});

function chunkify(a, n, balanced) {
  if (n < 2)
    return [a];

  let len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  }

  else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  }

  else {

    n--;
    size = Math.floor(len / n);
    if (len % size === 0)
      size--;
    while (i < size * n) {
      out.push(a.slice(i, i += size));
    }
    out.push(a.slice(size * n));

  }

  return out;
}