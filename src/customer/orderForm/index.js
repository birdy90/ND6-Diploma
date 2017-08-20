(() => {
  'use strict';

  angular
    .module('app')
    .controller('CustomerOrderFormController', CustomerOrderFormController);

  function CustomerOrderFormController($scope, $location, $interval, UserService, OrdersService) {
    let vm = this;

    if (UserService.user().name === '') {
      $location.path('/');
    }

    vm.imagePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIipQaS685K05hq4A8MynuP86nl9cKSMRVB6TVAScZmIKkkRi2AA';
    vm.discount = 5;
    vm.statuses = OrdersService.statuses;
    vm.endTime = Date.now();
    vm.user = UserService.user();

    vm.menu = [];
    vm.menuParted = [];
    vm.orders = [];

    vm.receiveMoney = receiveMoney;
    vm.buy = createOrder;
    vm.cancel = cancelOrder;
    vm.reorder = repeatOrder;
    vm.exit = exit;

    $interval(() => vm.endTime = Date.now(), 1000);

    UserService.getUser(UserService.user())
      .then(() => {
        refreshMoney();
        refreshOrders();
      });

    OrdersService.getMenu()
      .then(({menu, menuParted}) => {
        vm.menu = menu;
        vm.menuParted = menuParted;
        $scope.$apply();
      });

    socket.on('disconnect', () => vm.exit());
    socket.on('refreshOrders', () => refreshOrders());
    socket.on('refreshMoney', () => refreshMoney());

    function refreshMoney() {
      UserService.getMoney()
        .then(data => {
          vm.user.money = data;
          $scope.$apply();
        });
    }

    function refreshOrders() {
      OrdersService.getUserOrders()
        .then(orders => {
          vm.orders = orders || [];
          $scope.$apply();
        });
    }

    function receiveMoney() {
      vm.user.money += parseFloat(100);
      UserService.setMoney(vm.user.money);
      socket.emit('addMoney');
    }

    function createOrder(item) {
      vm.user.money -= parseFloat(item.price);
      UserService.buy(item.price);
      const newItem = OrdersService.addOrder(item);
      vm.orders.push(newItem);
      socket.emit('newOrder');
    }

    function cancelOrder(item) {
      vm.user.money += item.price;
      UserService.setMoney(vm.user.money);
      OrdersService.cancelOrder({user: UserService.user(), order: item});
      const i = vm.orders.indexOf(item);
      if (i !== -1) {
        vm.orders.splice(i, 1);
      }
      socket.emit('cancelOrder');
      socket.emit('addMoney');
    }

    function repeatOrder(item) {
      OrdersService.cancelOrder({user: UserService.user(), order: item})
        .then(() => {
          const i = vm.orders.indexOf(item);
          if (i !== -1) {
            vm.orders.splice(i, 1);
          }
          vm.user.money += parseFloat((item.price * vm.discount / 100).toFixed(4));
          UserService.setMoney(vm.user.money);
          item.price *= (1 - vm.discount / 100);
          const newItem = OrdersService.addOrder(item);
          vm.orders.push(newItem);
          socket.emit('newOrder');
          socket.emit('addMoney');
        });
      socket.emit('cancelOrder');
    }

    function exit() {
      vm.user = UserService.emptyUser;
      $location.path('/');
    }
  }
})();