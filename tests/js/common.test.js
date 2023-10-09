const jewire = require('../../src');

const {
  arraysCommon
} = jewire('./common');

test('testing example', () => {
  expect(arraysCommon([1, 2], [3, 2])).toStrictEqual([2]);
});
