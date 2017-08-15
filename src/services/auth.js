customerApp.factory('UserService', function($resource) {
  let user = {
    name: 'Григорий Бедердинов',
    email: 'gob@live.ru',
    money: 0,
  };

  const moneyResource = $resource('http://localhost:8000/api/money/:email', {email: '@email'});

  return {
    user: user,
    clear: (() => {
      user.name = '';
      user.email = '';
      user.money = 0;
    }),
    getMoney: () => new Promise((done, fail) => {
      moneyResource.get({email: user.email}, data => done(data.answer[0].money));
    }),
    buy: cost => {
      user.money -= cost;
    }
  }
});