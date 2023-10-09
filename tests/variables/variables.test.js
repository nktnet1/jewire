import jewire from '../../src';

const {
  numberFive,
  array,
  shallowObject,
  arrayOfObjects,
  deeplyNestedObject,
} = jewire('./variables');

test('variables are imported correctly', () => {
  expect(numberFive).toStrictEqual(5);
});

test('arrays are imported correctly', () => {
  expect(array).toStrictEqual([1, 2, 3]);
});

test('object are strictly equal', () => {
  expect(shallowObject).toStrictEqual({ key1: 'key1', key2: 2 });
});

test('nested object passes strict equality', () => {
  const expected = {
    key1: 'value1',
    key2: {
      nested: {
        array: [1, 2, 3],
      }
    }
  };
  expect(deeplyNestedObject).toStrictEqual(expected);
});

test('Array of Objects', () => {
  expect(arrayOfObjects).toStrictEqual([{ name: 'Tam', age: 22 }, { name: 'Spam', age: 23 }]);
});
