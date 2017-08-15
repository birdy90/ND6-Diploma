'use strict';
const customerApp = angular.module('kitchen', ['ngRoute', 'ngResource', 'ngMaterial', 'angularMoment']);

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
  })
  .filter('secondsToTimeString', function() {
    return function(input) {
      const oneSecond = 1;
      const oneMinute = oneSecond * 60;
      const oneHour = oneMinute * 60;
      const oneDay = oneHour * 24;

      const days = Math.floor(input / oneDay);
      const hours = Math.floor((input % oneDay) / oneHour) + days * 24;
      const minutes = Math.floor((input % oneHour) / oneMinute);
      const seconds = Math.floor(input % oneMinute);

      return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
    };
  });