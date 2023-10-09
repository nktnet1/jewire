import jewire from '../../src';

test('Using different basePath', () => {
  const { numberFive } = jewire('./tests/variables/variables', { basePath: process.cwd() });
  expect(numberFive).toStrictEqual(5);
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
