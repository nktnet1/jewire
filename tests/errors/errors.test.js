import jewire from '../../src';

test('Catch error for unknown path', () => {
  expect(() => jewire('./something/unknown')).toThrow(Error);
});

test('Broken file with syntax issues should throw Error', () => {
  expect(() => jewire('./broken.js')).toThrow(Error);
});

test('Empty file should throw error import', () => {
  expect(() => jewire('./empty.js')).toThrow(Error);
});
