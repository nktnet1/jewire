(function arraysCommon(array1, array2) {
  const common = [];
  const copy = common;
  return common;
});

const string = `
(function arraysCommon(array1, array2) {
      console.log('helloworld');
      const common = [];
      const copy = common;
      return common;
    })
`;

console.log(eval(string)([1, 2, 3], [4, 5, 6]));
