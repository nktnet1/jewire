import jewire from '../../src';

const { TestClass } = jewire('./classes');

let instance;

beforeEach(() => {
  instance = new TestClass('Tam', ['Ham', 'Spam']);
});

test('Basic class method', () => {
  expect(instance.getName()).toStrictEqual('Tam');
});

test('Basic class array return', () => {
  expect(instance.getNames()).toStrictEqual(['Ham', 'Spam']);
});

test('Basic class object return', () => {
  expect(instance.getObject()).toStrictEqual({ key1: 'value1', key2: 2 });
});

test('Class array of objects return', () => {
  expect(instance.getArrayOfObjects()).toStrictEqual([
    { name: 'Tam', age: 22 },
    { name: 'Spam', age: 23 },
  ]);
});

test('Deeply nested object return', () => {
  expect(instance.getDeeplyNestedObject()).toStrictEqual({
    key1: 'value1',
    key2: {
      nested: {
        array: [1, 2, 3],
      },
    }
  });
});
