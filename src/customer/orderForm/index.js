'use strict';

customerApp
  .controller('CustomerOrderFormController', function($scope, $http, $mdDialog, $location, UserService) {
    if (UserService.user.name === '') {
      $location.path('/');
    }

    $scope.user = UserService.user;
    $scope.imagePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIipQaS685K05hq4A8MynuP86nl9cKSMRVB6TVAScZmIKkkRi2AA';

    $scope.menu = null;

    $http.get('/media/menu.json')
      .then(function (data) {
        $scope.menu = data.data;
        $scope.menuParted = chunkify($scope.menu, 3, true);
      });

    $scope.exit = () => {
      UserService.clear();
      $location.path('/');
    };

    $scope.getMoney = () => {
      UserService.user.money += 100;
    };

    $scope.buy = (item) => {
      UserService.buy(item.price)
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