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
      expect(hE.symbols.variables).toStrictEqual([
        'numberFive', 'array', 'shallowObject', 'arrayOfObjects', 'deeplyNestedObject',
      ]);
    }
  });
});

test('callback function rewireContext return value is cloned', () => {
  jewire('../functions/functions', {
    callback: (rewireContext, _) => {
      expect(rewireContext.__get__('getObject')()).toStrictEqual({
        key1: 'value1',
        key2: 2,
      });
      expect(rewireContext.__get__('getArrayOfObjects')()).toStrictEqual([
        { name: 'Tam' },
        { name: 'Ham' },
      ]);
      expect(rewireContext.__get__('getDeeplyNestedObject')()).toStrictEqual({
        key1: 'value1',
        key2: {
          nested: {
            array: [1, 2, 3],
          },
        }
      });
    }
  });
});
