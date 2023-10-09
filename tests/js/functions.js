/* eslint-disable @typescript-eslint/no-unused-vars */

const numberFive = 5;

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
        array: 'helloworld',
      }
    }
  };
};

function twoArrays(array1, array2) {
  return array1.concat(array2);
}
