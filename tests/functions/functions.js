/* eslint-disable @typescript-eslint/no-unused-vars */

const sum = (a, b) => a + b;

const getArrayArrowFunction = (n) => {
  return Array.from({ length: n }, (_, index) => index + 1);
};

function getArrayNormalFunction (n) {
  return Array.from({ length: n }, (_, index) => index + 1);
}

const getObject = () => {
  return {
    key1: 'value1',
    key2: 2,
  };
};

const getDeeplyNestedObject = () => {
  return {
    key1: 'value1',
    key2: {
      nested: {
        array: [1, 2, 3],
      },
    }
  };
};

const getArrayOfObjects = () => [
  {
    name: 'Tam',
  },
  {
    name: 'Ham',
  },
];
