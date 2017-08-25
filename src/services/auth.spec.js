describe('auth service testing', () => {
  let service;
  let spies = {};

  beforeEach(module('app'));
  beforeEach(() => {
    inject($injector => {
      service = $injector.get('UserService');
      spies.userResourceGet = chai.spy.on(service.userResource, 'get');
    });
  });

  it('should return a user', () => {
    const user = service.user();
    expect(user).to.have.own.property('name');
    expect(user).to.have.own.property('email');
    expect(user).to.have.own.property('money');

    expect(spies.userResourceGet).to.have.been.called();
  });

  it('should use user resource', () => {
    service.getUser();

    expect(spies.userResourceGet).to.have.been.called();
  });

  it('should decrease money', () => {
    const moneyToSpend = 23;
    const moneyBefore = service.user().money;
    service.buy(moneyToSpend);
    const moneyAfter = moneyBefore - service.user().money;
    expect(moneyAfter).to.be.equal(moneyToSpend);
  });
});