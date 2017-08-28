describe('auth service testing', () => {
  let service = null;
  let httpBackend = null;

  beforeEach(module('app'));
  beforeEach(() => {
    inject(($injector, $httpBackend) => {
      service = $injector.get('UserService');
      httpBackend = $httpBackend;
    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should return a user', () => {
    const user = service.user();
    expect(user).to.have.own.property('name');
    expect(user).to.have.own.property('email');
    expect(user).to.have.own.property('money');

  });

  it('should use user resource', done => {
    httpBackend.expectGET('/api/user/gob@live.ru').respond({answer: [{email: 'gob@live.ru', money: 123}]});
    service
      .getUser({email: 'gob@live.ru'})
      .then(data => {
        expect(data.email).to.be.equal('gob@live.ru');
        expect(data.money).to.be.equal(123);
        done();
      })
      .catch(err => console.log(err) );
    httpBackend.flush();
  });

  it('should get money', done => {
    httpBackend.expectGET('/api/user/gob@live.ru').respond({answer: [{email: 'gob@live.ru', money: 123}]});
    service
      .getUser({email: 'gob@live.ru'})
      .then(userInstance => {
        httpBackend.expectGET('/api/money/gob@live.ru').respond({answer: [{money: userInstance.money}]});
        service.getMoney()
          .then(data => {
            expect(data).to.be.equal(userInstance.money);
            done();
          })
          .catch(err => console.log(err) );
        httpBackend.flush();
      });
    httpBackend.flush();
  });

  it('should set money', done => {
    const moneyToSet = 111;

    httpBackend.expectGET('/api/user/gob@live.ru').respond({answer: [{email: 'gob@live.ru', money: 123}]});
    service
      .getUser({email: 'gob@live.ru'})
      .then(userInstance => {
        httpBackend.expectPOST('/api/money/gob@live.ru', {email: userInstance.email, money: moneyToSet}).respond({answer: [{money: moneyToSet}]});
        service.setMoney(moneyToSet)
          .then(data => {
            expect(data).to.be.equal(moneyToSet);
            done();
          })
          .catch(err => console.log(err) );
        httpBackend.flush();
      });
    httpBackend.flush();
  });

  it('should decrease money', () => {
    const moneyToSpend = 23;
    const moneyBefore = service.user().money;
    service.buy(moneyToSpend);
    const moneyAfter = moneyBefore - service.user().money;
    expect(moneyAfter).to.be.equal(moneyToSpend);
  });
});