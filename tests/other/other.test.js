import jewire from '../../src';

test('Include extension', () => {
  const { numberFive } = jewire('../variables/variables.js');
  expect(numberFive).toStrictEqual(5);
});
