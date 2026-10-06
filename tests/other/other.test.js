import jewire from "../../src";
import { getCallerDirname } from "../../src/files";

test("Include extension", () => {
  const { numberFive } = jewire("../variables/variables.js");
  expect(numberFive).toStrictEqual(5);
});

test("Missing caller stack frame returns an empty path", () => {
  const captureStackTrace = jest
    .spyOn(Error, "captureStackTrace")
    .mockImplementation((target) => {
      Object.defineProperty(target, "stack", {
        configurable: true,
        value: [],
      });
    });

  try {
    expect(getCallerDirname()).toStrictEqual("");
  } finally {
    captureStackTrace.mockRestore();
  }
});
