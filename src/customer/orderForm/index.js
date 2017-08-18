'use strict';

app
  .controller('CustomerOrderFormController', function($scope, $http, $mdDialog, $location, UserService, OrdersService) {
    if (UserService.user().name === '') {
      $location.path('/');
    }

    $scope.discount = 5;

    $scope.endTime = Date.now();
    setInterval(() => {
      $scope.endTime = Date.now();
      $scope.$apply();
    }, 1000);

    $scope.user = UserService.user();

    const refreshMoney = () => {
      UserService.getMoney()
        .then(data => {
          $scope.user.money = data;
          $scope.$apply();
        });
    };

    $scope.imagePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIipQaS685K05hq4A8MynuP86nl9cKSMRVB6TVAScZmIKkkRi2AA';

    $scope.statuses = OrdersService.statuses;

    $scope.orders = [];
    const refreshOrders = () => {
      OrdersService.getUserOrders()
        .then(orders => {
          $scope.orders = orders || [];
          $scope.$apply();
        });
    };

    UserService.getUser(UserService.user())
      .then(() => {
        refreshMoney();
        refreshOrders();
      });

    $scope.menu = [];
    $scope.menuParted = [];

    OrdersService.getMenu()
      .then(({menu, menuParted}) => {
        $scope.menu = menu;
        $scope.menuParted = menuParted;
        $scope.$apply();
      });


    $scope.exit = () => {
      $scope.user = UserService.emptyUser;
      $location.path('/');
    };

    $scope.receiveMoney = () => {
      $scope.user.money += parseFloat(100);
      UserService.setMoney($scope.user.money);
      socket.emit('addMoney');
    };

    $scope.buy = item => {
      $scope.user.money -= parseFloat(item.price);
      UserService.buy(item.price);
      const newItem = OrdersService.addOrder(item);
      $scope.orders.push(newItem);
      socket.emit('newOrder');
    };

    $scope.cancel = item => {
      $scope.user.money += item.price;
      UserService.setMoney($scope.user.money);
      OrdersService.cancelOrder({user: UserService.user(), order: item});
      const i = $scope.orders.indexOf(item);
      if (i !== -1) {
        $scope.orders.splice(i, 1);
      }
      socket.emit('cancelOrder');
      socket.emit('addMoney');
    };

    $scope.reorder = item => {
      OrdersService.cancelOrder({user: UserService.user(), order: item})
        .then(() => {
          const i = $scope.orders.indexOf(item);
          if (i !== -1) {
            $scope.orders.splice(i, 1);
          }
          $scope.user.money += parseFloat((item.price * $scope.discount / 100).toFixed(4));
          UserService.setMoney($scope.user.money);
          item.price *= (1 - $scope.discount / 100);
          const newItem = OrdersService.addOrder(item);
          $scope.orders.push(newItem);
          socket.emit('newOrder');
          socket.emit('addMoney');
        });
      socket.emit('cancelOrder');
    };

    socket.on('disconnect', () => $scope.exit());

    socket.on('refreshOrders', () => refreshOrders());
    socket.on('refreshMoney', () => refreshMoney());
  });