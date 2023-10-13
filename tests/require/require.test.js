import jewire from '../../src';

const { sum, sumWithFive, object } = jewire('./require');

test('Retrieving from require', () => {
  expect(sum(10, 20)).toStrictEqual(30);
});

test('Using function from require', () => {
  expect(sumWithFive(20)).toStrictEqual(25);
});

test('Object from require', () => {
  expect(object).toStrictEqual({
    key1: 'value1',
    key2: {
      nested: {
        array: [1, 2, 3],
      },
    }
  });
});
