import jewire from '../../src';

test('Imported ts function successfully', () => {
  const { tsEchoFunction: tsFunction } = jewire('./functions');
  expect(tsFunction('hi there')).toStrictEqual('hi there');
});

test('Imported ts function with file extension', () => {
  const { tsEchoFunction: tsFunctionFileExtension } = jewire('./functions.ts');
  expect(tsFunctionFileExtension('hi there')).toStrictEqual('hi there');
});

test('Broken file with syntax issues should throw Error', () => {
  expect(() => jewire('./broken.ts')).toThrow(Error);
});

test('Empty file should throw error import', () => {
  expect(() => jewire('./empty.ts')).toThrow(Error);
});
