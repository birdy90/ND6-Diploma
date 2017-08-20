(() => {
  'use strict';

  angular
    .module('app')
    .config(($routeProvider, $locationProvider) => {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/', {
          templateUrl: '/static/customer/auth/index.html',
          controller: 'CustomerAuthController',
          controllerAs: 'vm'
        })
        .when('/list', {
          templateUrl: '/static/customer/orderForm/index.html',
          controller: 'CustomerOrderFormController',
          controllerAs: 'vm'
        })
        .otherwise({redirectTo: '/'});
    })
})();