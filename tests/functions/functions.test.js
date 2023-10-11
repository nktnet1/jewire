import jewire from '../../src';

const {
  sum,
  getArrayArrowFunction,
  getArrayNormalFunction,
  getObject,
  getDeeplyNestedObject,
  getArrayOfObjects,
} = jewire('./functions');

test('Sum 10 and 20', () => {
  expect(sum(10, 20)).toStrictEqual(30);
});

test('arrow functions return correct array', () => {
  expect(getArrayArrowFunction(3)).toStrictEqual([1, 2, 3]);
});

test('normal functions return correct array', () => {
  expect(getArrayNormalFunction(5)).toStrictEqual([1, 2, 3, 4, 5]);
});

test('object return type is consistent', () => {
  expect(getObject()).toStrictEqual({ key1: 'value1', key2: 2 });
});

test('object return type is consistent', () => {
  const received = getDeeplyNestedObject();
  const expected = {
    key1: 'value1',
    key2: {
      nested: {
        array: [1, 2, 3],
      }
    }
  };
  expect(received).toStrictEqual(expected);
});

test('Array of Objects', () => {
  expect(getArrayOfObjects()).toStrictEqual([{ name: 'Tam' }, { name: 'Ham' }]);
});
