app
  .factory('UserService', function($resource) {
    const emptyUser = {
      name: '',
      email: '',
      money: 0,
    };
    let user = emptyUser;

    const userResource = $resource('/api/user/:email', {email: '@email'});
    const moneyResource = $resource('/api/money/:email', {email: '@email'});

    return {
      user: () => user,
      emptyUser: emptyUser,

      getUser: data => new Promise((done, fail) => {
        userResource.get({email: data.email}, resourceData => {
          if (resourceData.answer.length === 0) {
            data.money = 100;
            userResource.save({user: data});
            resourceData = data;
          } else {
            resourceData = resourceData.answer[0];
          }
          user = resourceData;
          user.name = data.name;
          done(user);
        });
      }),

      getMoney: () => new Promise((done, fail) => {
        moneyResource.get({email: user.email}, data => done(data.answer[0].money));
      }),

      setMoney: amount => new Promise((done, fail) => {
        user.money = amount;
        moneyResource.save({email: user.email, money: amount}, data => done(data.answer[0].money));
      }),

      buy: cost => {
        user.money -= cost;
      }
    }
  });