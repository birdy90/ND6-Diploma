(() => {
  'use strict';

  angular.module('app')
    .config($routeProvider => {
      $routeProvider
        .when('/', {
          templateUrl: '/static/chef/orders/index.html',
          controller: 'ChefOrdersController',
          controllerAs: 'vm'
        })
        .otherwise({redirectTo: '/'});
    });
})();