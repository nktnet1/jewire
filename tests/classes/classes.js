/* eslint-disable @typescript-eslint/no-unused-vars */

class TestClass {
  constructor(name, names) {
    this.name = name;
    this.names = names;
  }

  getName() {
    return this.name;
  }

  getNames() {
    return this.names;
  }

  getObject() {
    return {
      key1: 'value1', key2: 2,
    };
  }

  getArrayOfObjects() {
    return [
      { name: 'Tam', age: 22 },
      { name: 'Spam', age: 23 },
    ];
  }

  getDeeplyNestedObject() {
    return {
      key1: 'value1',
      key2: {
        nested: {
          array: [1, 2, 3],
        },
      }
    };
  }
}
