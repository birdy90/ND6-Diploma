'use strict';
const customerApp = angular.module('kitchen', ['ngRoute', 'ngMaterial']);

customerApp
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('pink');
  })
  .config(($routeProvider) => {
    $routeProvider
      .when('/', {templateUrl: '/static/customer/auth/index.html', controller: 'CustomerAuthController'})
      .when('/list', {templateUrl: '/static/customer/orderForm/index.html', controller: 'CustomerOrderFormController'})
      .otherwise({redirectTo: '/'});
  });