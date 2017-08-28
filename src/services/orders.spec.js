describe('orders service testing', () => {
  let user = null;
  let service = null;
  let httpBackend = null;

  beforeEach(module('app'));
  beforeEach(() => {
    inject(($injector, $httpBackend) => {
      user = $injector.get('UserService');
      service = $injector.get('OrdersService');
      httpBackend = $httpBackend;
    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('get user orders many', done => {
    httpBackend.expectGET('/api/user/gob@live.ru').respond({answer: [{email: 'gob@live.ru', money: 123}]});
    user
      .getUser({email: 'gob@live.ru'})
      .then(data => {
        httpBackend.expectGET('/api/orders/gob@live.ru').respond({answer: [{orders: [{}, {}]}]});
        service
          .getUserOrders()
          .then(data => {
            expect(data.length).to.be.equal(2);
            done();
          })
          .catch(err => console.log(err) );
        httpBackend.flush();
      });
    httpBackend.flush();
  });

  it('get user orders empty', done => {
    httpBackend.expectGET('/api/user/gob@live.ru').respond({answer: [{email: 'gob@live.ru', money: 123}]});
    user
      .getUser({email: 'gob@live.ru'})
      .then(data => {
        httpBackend.expectGET('/api/orders/gob@live.ru').respond({answer: [{orders: []}]});
        service
          .getUserOrders()
          .then(data => {
            expect(data.length).to.be.equal(0);
            done();
          })
          .catch(err => console.log(err) );
        httpBackend.flush();
      });
    httpBackend.flush();
  });

  it('get user orders errored', done => {
    httpBackend.expectGET('/api/user/gob@live.ru').respond({answer: [{email: 'gob@live.ru', money: 123}]});
    user
      .getUser({email: 'gob@live.ru'})
      .then(data => {
        httpBackend.expectGET('/api/orders/gob@live.ru').respond({answer: []});
        service
          .getUserOrders()
          .then(data => {
            expect(data.length).to.be.equal(0);
            done();
          })
          .catch(err => console.log(err) );
        httpBackend.flush();
      });
    httpBackend.flush();
  });
});