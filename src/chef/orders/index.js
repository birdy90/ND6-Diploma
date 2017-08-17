'use strict';

app
  .controller('ChefOrdersController', function($scope, $mdDialog, $location, OrdersService) {
    $scope.connected = true;

    $scope.endCookingTime = Date.now();
    setInterval(() => {
      $scope.endCookingTime = Date.now();
      $scope.$apply();
    }, 1000);

    $scope.newOrders = [];
    $scope.cookingOrders = [];

    const updateOrders = () => {
      $scope.endCookingTime = Date.now();
      OrdersService.getNewOrders()
        .then(orders => {
          $scope.newOrders = orders;
          $scope.$apply();
        });
      OrdersService.getCookingOrders()
        .then(orders => {
          $scope.cookingOrders = orders;
          $scope.$apply();
        });
    };

    updateOrders();

    $scope.startCooking = item => {
      item.startCooking = Date.now();
      OrdersService.startCooking(item);
      updateOrders();
      socket.emit('chefUpdatedStatus', {email: item.email});
    };

    $scope.endCooking = item => {
      console.log(item);
      item.endCooking = Date.now();
      OrdersService.endCooking(item);
      updateOrders();
      socket.emit('chefUpdatedStatus', {email: item.email});
      socket.emit('startDelivery', {user: item, })
    };

    socket.on('connect', () => {
      $scope.connected = true;
      $scope.$apply();
    });
    socket.on('disconnect', () => {
      $scope.connected = false;
      $scope.$apply();
    });
    socket.on('newOrder', () => updateOrders());
  });