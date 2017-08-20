(() => {
  'use strict';

  angular.module('app')
    .service('UserService', UserService);

  function UserService($resource) {
    this.emptyUser = {
      name: '',
      email: '',
      money: 0,
    };

    let userInstance = this.emptyUser;

    this.userResource = $resource('/api/user/:email', {email: '@email'});
    this.moneyResource = $resource('/api/money/:email', {email: '@email'});

    this.user = () => userInstance;

    this.getUser = data => new Promise((done, fail) => {
      this.userResource.get({email: data.email}, resourceData => {
        if (resourceData.answer.length === 0) {
          data.money = 100;
          this.userResource.save({user: data});
          resourceData = data;
        } else {
          resourceData = resourceData.answer[0];
        }
        userInstance = resourceData;
        userInstance.name = data.name;
        done(userInstance);
      });
    });

    this.getMoney = () => new Promise((done, fail) => {
      this.moneyResource.get({email: userInstance.email}, data => done(data.answer[0].money));
    });

    this.setMoney = amount => new Promise((done, fail) => {
      userInstance.money = amount;
      this.moneyResource.save({email: userInstance.email, money: amount}, data => done(data.answer[0].money));
    });

    this.buy = cost => {
      userInstance.money -= cost;
    }
  }
})();