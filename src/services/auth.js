customerApp.factory('UserService', function() {
  let user = {
    name: 'Григорий Бедердинов',
    email: 'gob@live.ru',
    money: 100,
  };

  return {
    user: user,
    clear: (() => {
      user.name = '';
      user.email = '';
      user.money = 0;
    }),
    buy: cost => {
      user.money -= cost;
    }
  }
});