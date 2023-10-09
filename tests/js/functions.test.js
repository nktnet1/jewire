const jewire = require('../../src');

const {
  numberFive,
  getArrayArrowFunction,
  getArrayNormalFunction,
  getObject,
  getDeeplyNestedObject,
  twoArrays,
} = jewire('./functions');

test('variables are imported correctly', () => {
  expect(numberFive).toStrictEqual(5);
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
  expect(getDeeplyNestedObject()).toStrictEqual(
    {
      key1: 'value1',
      key2: {
        nested: {
          array: 'helloworld',
        }
      }
    }
  );
});

test('Catch error for unknown path', () => {
  expect(() => jewire('./something/unknown')).toThrow(Error);
});

test('two arrays', () => {
  expect(twoArrays([1, 2], [3, 4])).toStrictEqual([1, 2, 3, 4]);
});
