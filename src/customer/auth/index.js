'use strict';

app
  .controller('CustomerAuthController', function($scope, $mdDialog, $location, UserService) {
    $scope.user = {};

    $scope.$on('$viewContentLoaded', function (e) {
      showPrompt($scope);
    });

    $scope.submit = () => {
      if ($scope.loginForm.$valid) {
        $mdDialog.hide($scope.loginForm);
        UserService.getUser($scope.user)
          .then(data => {
            $scope.user = data;
            socket.emit('handshake', {type: 'customer', email: UserService.user().email});
            $scope.$apply();
            $location.path("/list");
          });
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