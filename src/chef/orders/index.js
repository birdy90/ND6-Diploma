(() => {
  'use strict';

  angular.module('app')
    .controller('ChefOrdersController', ChefOrdersController);

  function ChefOrdersController($scope, $interval, OrdersService) {
    let vm = this;

    let socket = io(`http://${window.location.hostname}:8000`);
    socket.emit('handshake', {type: 'chef'});

    vm.connected = true;
    vm.endCookingTime = Date.now();
    vm.newOrders = [];
    vm.cookingOrders = [];

    vm.startCooking = startCooking;
    vm.endCooking = endCooking;

    updateOrders();
    $interval(() => vm.endCookingTime = Date.now(), 1000);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newOrder', updateOrders);
    socket.on('deliverySuccessfull', onDeliverySuccessful);
    socket.on('deliveryFailed', onDeliveryFailed);

    function onConnect() {
      socket.emit('handshake', {type: 'chef'});
      vm.connected = true;
      $scope.$apply();
    }

    function onDisconnect() {
      vm.connected = false;
      $scope.$apply();
    }

    function onDeliverySuccessful(item) {
      OrdersService
        .endDelivery(item, [['endTime', Date.now()],], true)
        .then(() => {
          socket.emit('chefUpdatedStatus', {email: item.email})
        });
    }

    function onDeliveryFailed(item) {
      OrdersService
        .endDelivery(item, [['endTime', Date.now()],], false)
        .then(() => {
          socket.emit('chefUpdatedStatus', {email: item.email})
        });
    }

    function updateOrders() {
      vm.endCookingTime = Date.now();
      OrdersService.getNewOrders()
        .then(orders => {
          vm.newOrders = orders;
          $scope.$apply();
        });
      OrdersService.getCookingOrders()
        .then(orders => {
          vm.cookingOrders = orders;
          $scope.$apply();
        });
    }

    function startCooking(item) {
      OrdersService.startCooking(item,
        [['startCooking', Date.now()],]
      );
      updateOrders();
      socket.emit('chefUpdatedStatus', {email: item.email});
    }

    function endCooking(item) {
      OrdersService.endCooking(item,
        [['endCooking', Date.now()],]
      );
      updateOrders();
      socket.emit('chefUpdatedStatus', {email: item.email});
      socket.emit('startDelivery', {user: item, order: item.orders});
    }
  }
})();