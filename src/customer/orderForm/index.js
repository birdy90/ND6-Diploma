'use strict';

customerApp
  .controller('CustomerOrderFormController', function($scope, $http, $mdDialog, $location, UserService, OrdersService) {
    if (UserService.user.name === '') {
      $location.path('/');
    }

    $scope.user = UserService.user;
    $scope.imagePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIipQaS685K05hq4A8MynuP86nl9cKSMRVB6TVAScZmIKkkRi2AA';

    $scope.states = OrdersService.states;
    $scope.orders = OrdersService.orders;

    $scope.menu = [];
    $scope.menuParted = [];

    OrdersService.getMenu()
      .then(({menu, menuParted}) => {
        OrdersService.menu = menu;
        OrdersService.menuParted = menuParted;

        $scope.menu = OrdersService.menu;
        $scope.menuParted = OrdersService.menuParted;
        $scope.$apply();
      });

    $scope.exit = () => {
      UserService.clear();
      $location.path('/');
    };

    $scope.getMoney = () => {
      UserService.user.money += 100;
    };

    $scope.buy = (item) => {
      console.log(item);
      console.log('buy clicked');
      UserService.buy(item.price);
      OrdersService.addOrder(item);
      let order = new OrdersService.db({test: 'test'});
      order.test2 = 'rtyqwe';
      order.$save({test3: 'test1'}, data => {
        console.log('success: ' + data);
      }, data => {
        console.log('error: ' + data);
      });
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