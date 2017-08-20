let socket = undefined;
socket = io(`http://${window.location.hostname}:8000`);

(() => {
  'use strict';

  angular.module('app', [
    'ngRoute',
    'ngResource',
    'ngMaterial',
    'angularMoment',
  ]);
})();