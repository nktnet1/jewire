import jewire from '../../src';

test('Imported ts function from outside directory', () => {
  const { tsEchoFunction: tsFunction } = jewire('../ts/functions');
  expect(tsFunction('hi there')).toStrictEqual('hi there');
});
