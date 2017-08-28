describe('filters testing', () => {
  let filter = null;

  beforeEach(module('app'));
  beforeEach(() => {
    inject($filter => {
      filter = $filter;
    });
  });

  const secondsToStringFilterTests = [
    {input: 1, expect: '0:00:01'},
    {input: 100, expect: '0:01:40'},
    {input: 1000, expect: '0:16:40'},
    {input: 10000, expect: '2:46:40'},
    {input: 100000, expect: '27:46:40'}
  ];

  secondsToStringFilterTests.forEach(test => {
    it(`calculate time ${test.input} -> ${test.expect}`, () => {
      const stringTime = filter('secondsToTimeString')(test.input);
      expect(stringTime).to.be.equal(test.expect);
    });
  });
});