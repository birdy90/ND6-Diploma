(() => {
  'use strict';

  angular
    .module('app')
    .controller('CustomerAuthController', CustomerAuthController);

  function CustomerAuthController($scope, $mdDialog, $location, UserService) {
    let vm = this;

    $scope.$on('$viewContentLoaded', onViewContentLoaded);

    vm.user = {};
    vm.submit = onSubmit;

    function onSubmit() {
      if ($scope.loginForm.$valid) {
        $mdDialog.hide($scope.loginForm);
        UserService.getUser(vm.user)
          .then(data => {
            vm.user = data;
            socket.emit('handshake', {type: 'customer', email: UserService.user().email});
            $location.path("/list");
          });
      }
    }

    function onViewContentLoaded(e) {
      showPrompt(vm);
    }

    function showPrompt(form) {
      $mdDialog.show({
        controller: 'CustomerAuthController',
        controllerAs: 'vm',
        templateUrl: '/static/customer/auth/form.html',
        escapeToClose: false,
      });
    }
  }
})();