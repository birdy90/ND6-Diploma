'use strict';

customerApp.controller('CustomerAuthController', function($scope, $mdDialog, $location, UserService) {
  $scope.user = UserService.user;

  $scope.$on('$viewContentLoaded', function(e){
    showPrompt($scope);
  });

  $scope.submit = () => {
    if ($scope.loginForm.$valid) {
      $location.path("/list");
      $mdDialog.hide($scope.loginForm);
      UserService.user = $scope.user;
    }
  };

  const showPrompt = form => {
    $mdDialog.show({
      controller: 'CustomerAuthController',
      templateUrl: '/static/customer/auth/form.html',
      escapeToClose: false,
    });
  };
});