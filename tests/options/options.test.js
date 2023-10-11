import jewire from '../../src';

test('Using different basePath', () => {
  const { numberFive } = jewire('./tests/variables/variables', { basePath: process.cwd() });
  expect(numberFive).toStrictEqual(5);
});

test('Using different objectClone', () => {
  const { getDeeplyNestedObject } = jewire(
    '../functions/functions',
    { objectClone: (o) => JSON.parse(JSON.stringify(o)) }
  );
  expect(getDeeplyNestedObject()).toStrictEqual({
    key1: 'value1',
    key2: {
      nested: {
        array: [1, 2, 3],
      },
    }
  });
});

test('callback function upon success', () => {
  jewire('../variables/variables', {
    callback: (_, hE) => {
      expect(hE.exports.variables).toStrictEqual([
        'numberFive', 'array', 'shallowObject', 'arrayOfObjects', 'deeplyNestedObject',
      ]);
    }
  });
});
