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
      OrdersService.startCooking(item, {startCooking: Date.now()});
      updateOrders();
      socket.emit('chefUpdatedStatus', {email: item.email});
    };

    $scope.endCooking = item => {
      OrdersService.endCooking(item, {endCooking: Date.now()});
      updateOrders();
      socket.emit('chefUpdatedStatus', {email: item.email});
      socket.emit('startDelivery', {user: item, order: item.orders});
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
    socket.on('deliverySuccessfull', item => {
      OrdersService.endDelivery(item, {endTime: Date.now()}, true)
        .then(() => {
          socket.emit('chefUpdatedStatus', {email: item.email})
        });
    });
    socket.on('deliveryFailed', item => {
      OrdersService.endDelivery(item, {endTime: Date.now()}, false)
        .then(() => {
          socket.emit('chefUpdatedStatus', {email: item.email})
        });
    });
  });