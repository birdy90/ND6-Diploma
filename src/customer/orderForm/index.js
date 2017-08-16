'use strict';

customerApp
  .controller('CustomerOrderFormController', function($scope, $http, $mdDialog, $location, UserService, OrdersService) {
    if (UserService.user().name === '') {
      $location.path('/');
    }

    $scope.endTime = Date.now();
    setInterval(() => {
      $scope.endTime = Date.now();
      $scope.$apply();
    }, 1000);

    $scope.user = UserService.user();
    UserService.getMoney()
      .then(data => {
        $scope.user.money = data;
        $scope.$apply();
      });

    $scope.imagePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIipQaS685K05hq4A8MynuP86nl9cKSMRVB6TVAScZmIKkkRi2AA';

    $scope.statuses = OrdersService.statuses;

    $scope.orders = [];
    OrdersService.getOrders()
      .then(orders => {
        $scope.orders = orders;
        $scope.$apply();
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
      UserService.user.money += 100;
    };

    $scope.buy = (item) => {
      UserService.buy(item.price);
      const newItem = OrdersService.addOrder(item);
      $scope.orders.push(newItem);
    }
  });