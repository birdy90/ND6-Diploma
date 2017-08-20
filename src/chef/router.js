(() => {
  'use strict';

  angular.module('app')
    .config(($routeProvider, $locationProvider) => {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/kitchen', {
          templateUrl: '/static/chef/orders/index.html',
          controller: 'ChefOrdersController',
          controllerAs: 'vm'
        });
    });
})();