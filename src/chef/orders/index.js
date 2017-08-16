'use strict';

app
  .controller('ChefOrdersController', function($scope, $mdDialog, $location, OrdersService) {
    $scope.endCooking = Date.now();
    setInterval(() => {
      $scope.endCooking = Date.now();
      $scope.$apply();
    }, 1000);

    $scope.newOrders = [];
    $scope.cookingOrders = [];

    const updateOrders = () => {
      OrdersService.getCookingOrders()
        .then(orders => {
          $scope.cookingOrders = orders;
          $scope.$apply();
        });
      OrdersService.getNewOrders()
        .then(orders => {
          $scope.newOrders = orders;
          $scope.$apply();
        });
    };

    updateOrders();

    $scope.startCooking = item => {
      item.startCooking = Date.now();
      OrdersService.startCooking(item);
      updateOrders();
    }
  });