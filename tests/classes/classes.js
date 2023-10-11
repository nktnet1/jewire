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

  getNameAsObject() {
    return {
      name: this.name,
      array: [this.name],
      object: {
        name: this.name,
        nameNested: {
          name: this.name,
        }
      },
      arrayOfObjects: [
        { name: this.name },
        { name: this.name }
      ]
    };
  }

  makeThisNonConfigurable() {
    console.log(this.name);
  }

  static getObject() {
    return { key1: 'value1', key2: 2 };
  }

  static getArrayOfObjects() {
    return [
      { name: 'Tam', age: 22 },
      { name: 'Spam', age: 23 },
    ];
  }

  static getDeeplyNestedObject() {
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

Object.defineProperty(TestClass.prototype, 'makeThisNonConfigurable', {
  configurable: false,
});

Object.defineProperty(TestClass.prototype, 'null', {});
