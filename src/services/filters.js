(() => {
  'use strict';

  angular.module('app')
    .filter('secondsToTimeString', () => secondsToStringFilter);

  function secondsToStringFilter(input) {
    const oneSecond = 1;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;

    const days = Math.floor(input / oneDay);
    const hours = Math.floor((input % oneDay) / oneHour) + days * 24;
    const minutes = Math.floor((input % oneHour) / oneMinute);
    const seconds = Math.floor(input % oneMinute);

    return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
  }
})();