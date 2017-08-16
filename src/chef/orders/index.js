'use strict';

app
  .controller('ChefOrdersController', function($scope, $mdDialog, $location, OrdersService) {
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
    };

    $scope.endCooking = item => {
      item.endCooking = Date.now();
      OrdersService.endCooking(item);
      updateOrders();
    };
  });