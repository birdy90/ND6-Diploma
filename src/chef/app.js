'use strict';

angular.module('myApp', [
  'ngRoute',
  'kitchen.customer',
  'kitchen.chef',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);