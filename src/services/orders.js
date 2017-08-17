app
  .factory('OrdersService', function($http, $resource, UserService) {
    const statuses = {
      ordered: {id: 1, title: 'Заказано'},
      cooking: {id: 2, title: 'Готовится'},
      delivery: {id: 3, title: 'Доставляется'},
      failed: {id: 4, title: 'Возникли сложности'},
      served: {id: 5, title: 'Подано'},
    };

    const chefResource = $resource('/api/chef/orders/:status', {status: '@status'});
    const resource = $resource('/api/orders/:email', {email: '@email'});

    const updateChefResource = (data, params, callback) => {
      chefResource.save(Object.assign(data, params), callback);
    };

    return {
      db: resource,

      statuses: statuses,
      getNewOrders: () => new Promise((done, fail) => {
        chefResource.get({status: statuses.ordered.id}, data => done(data.answer));
      }),
      getCookingOrders: () => new Promise((done, fail) => {
        chefResource.get({status: statuses.cooking.id}, data => done(data.answer));
      }),

      startCooking: (item, params) => new Promise((done, fail) => {
        updateChefResource({
          id: item._id,
          index: item.index,
          status: statuses.cooking.id,
          statusName: statuses.cooking.title,
        }, params, data => done(data.answer));
      }),
      endCooking: (item, params) => new Promise((done, fail) => {
        updateChefResource({
          id: item._id,
          index: item.index,
          status: statuses.delivery.id,
          statusName: statuses.delivery.title,
        }, params, data => done(data.answer));
      }),
      endDelivery: (item, params, success) => new Promise((done, fail) => {
        const status = success ? statuses.served : statuses.failed;
        updateChefResource({
          id: item._id,
          index: item.index,
          status: status.id,
          statusName: status.title,
        }, {}, params, data => done(data.answer));
        chefResource.save()
      }),

      getUserOrders: () => new Promise((done, fail) => {
        resource.get({email: UserService.user().email}, data => {
          if (data.answer.length > 0) {
            done(data.answer[0].orders)
          } else {
            done([])
          }
        });
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
          startCooking: null,
          endCooking: null,
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