(() => {
  'use strict';

  angular.module('app')
    .service('OrdersService', OrdersService);

  function OrdersService($http, $resource, UserService) {
    this.statuses = {
      ordered: {id: 1, title: 'Заказано'},
      cooking: {id: 2, title: 'Готовится'},
      delivery: {id: 3, title: 'Доставляется'},
      failed: {id: 4, title: 'Возникли сложности'},
      served: {id: 5, title: 'Подано'},
    };

    this.chefResource = $resource('/api/chef/orders/:status', {status: '@status'});
    this.resource = $resource('/api/orders/:email', {email: '@email'}, {
      delete: {
        method: 'DELETE',
        hasBody: true,
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      }
    });

    this.updateChefResource = (data, callback) => this.chefResource.save(data, callback);

    this.getNewOrders = () => new Promise((done, fail) => {
      this.chefResource.get({status: this.statuses.ordered.id}, data => done(data.answer));
    });

    this.getCookingOrders = () => new Promise((done, fail) => {
      this.chefResource.get({status: this.statuses.cooking.id}, data => done(data.answer));
    });

    this.startCooking = (item, params) => new Promise((done, fail) => {
      this.updateChefResource({
        id: item._id,
        index: item.index,
        status: this.statuses.cooking.id,
        statusName: this.statuses.cooking.title,
        additional: params
      }, data => done(data.answer));
    });

    this.endCooking = (item, params) => new Promise((done, fail) => {
      this.updateChefResource({
        id: item._id,
        index: item.index,
        status: this.statuses.delivery.id,
        statusName: this.statuses.delivery.title,
        additional: params
      }, data => done(data.answer));
    });

    this.endDelivery = (item, params, success) => new Promise((done, fail) => {
      const status = success ? this.statuses.served : this.statuses.failed;
      this.updateChefResource({
        id: item._id,
        index: item.index,
        status: status.id,
        statusName: status.title,
        additional: params
      }, data => done(data.answer));
    });

    this.getUserOrders = () => new Promise((done, fail) => {
      this.resource.get({email: UserService.user().email}, data => {
        if (data.answer.length > 0) {
          done(data.answer[0].orders)
        } else {
          done([])
        }
      });
    });

    this.getMenu = () => new Promise((done, fail) => {
      $http.get('/media/menu.json')
        .then((data) => {
          const menu = data.data;
          const menuParted = chunkify(menu, 3, true);
          done({menu, menuParted});
        });
    });

    this.addOrder = (item) => {
      let newItem = {
        price: item.price,
        orders: item.id,
        startTime: Date.now(),
        endTime: null,
        startCooking: null,
        endCooking: null,
        status: this.statuses.ordered
      };
      this.resource.save({
        user: UserService.user(),
        item: newItem
      });
      newItem.title = item.title;
      return newItem;
    };

    this.cancelOrder = (item) => new Promise((done, fail) => {
      this.resource.delete(item);
      done();
    })
  }

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
})();