const CONSTANT = 5;
function arraysCommon(array1, array2) {
  const common = [];
  const copy2 = [...array2];
  for (const element of array1) {
    if (copy2.includes(element)) {
      const res = copy2.splice(copy2.indexOf(element), 1);
      common.push(res[0]);
    }
  }
  return common;
}
