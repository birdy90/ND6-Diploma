customerApp.factory('OrdersService', function($http, $resource) {
  const states = {
    ordered: {id: 1, title: 'Заказано'},
    cooking: {id: 2, title: 'Готовится'},
    delivery: {id: 3, title: 'Доставляется'},
    failed: {id: 4, title: 'Возникли сложности'},
    served: {id: 5, title: 'Подано'},
  };

  const apiUrl = 'http://localhost:8000/api/orders/:id';

  let menu = null;
  let menuParted = null;

  let orders = []; // todo: get orders from DB

  return {
    db: $resource(apiUrl, {id: '@id'}),

    states: states,
    orders: orders,
    menu: menu,
    menuParted: menuParted,
    getMenu: () => new Promise((done, fail) => {
      $http.get('/media/menu.json')
        .then((data) => {
          menu = data.data;
          menuParted = chunkify(menu, 3, true);
          done({menu, menuParted});
        });
    }),
    addOrder: (item) => {
      orders.push({
        title: item.title,
        state: states.ordered
      });
    }
  }
});