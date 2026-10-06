import type { CloneFn } from "./types";

type RuntimeFunction = (...args: unknown[]) => unknown;
type ClassLike = object & { prototype: object };
type FunctionOrClass = RuntimeFunction | ClassLike;

/**
 * Checks if the provided value is a JavaScript function or a class constructor.
 * You should first check that `typeof functionOrClass === 'function'`
 *
 * @param {FunctionOrClass} functionOrClass - value known to be either a function or class
 * @returns {boolean} - `true` if the value is a function, false if it is a class
 */
const isFunction = (functionOrClass: FunctionOrClass): boolean => {
  const propertyNames = Object.getOwnPropertyNames(functionOrClass);
  return (
    !propertyNames.includes("prototype") || propertyNames.includes("arguments")
  );
};

/**
 * Deep clones an object or array, creating a new object with the
 * same structure and values.
 *
 * @param {T} obj - The object or array to deep clone.
 * @returns {T} - A deep clone of the input object or array.
 */
const objectClone: CloneFn = <T>(obj: T): T => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    // Empty array doesn't clone properly in Jest with just map
    return (obj.length === 0 ? [] : [...obj.map(objectClone)]) as T;
  }
  const cloneObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    cloneObj[key] = objectClone(value);
  }
  return cloneObj as T;
};

/**
 * Deepclones the return type of a function
 *
 * A cloned function here means that arrays and objects are repacked at runtime
 * through deepcloining such that the `expect.toStrictEqual` matcher from jest
 * can accurately compare, essentially removing jest comparison false-negative
 * issues relating to "serialises to the same string".
 *
 * @param fn - The function to be jewirified.
 * @param clone - The deep cloning function (defaulting to `deepClone`).
 * @returns A jewirified function.
 */
const functionClone = (
  fn: RuntimeFunction,
  clone: CloneFn,
): RuntimeFunction => {
  /**
   * Defines a new wrapper function that deep-clones the return value at run time
   *
   * @param args the arguments to be forwarded to the functions we are cloning
   * @returns the results of the function, deep copied at run time.
   */
  const wrapperClonedFunction = (...args: unknown[]): unknown => {
    const result = fn(...args);
    return result && typeof result === "object" ? clone(result) : result;
  };
  Object.defineProperty(wrapperClonedFunction, "name", {
    value: fn.name,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  return wrapperClonedFunction;
};

/**
 * For each of the method in the class, apply function/object clone at run time
 * for Jest expect.toStrictEqual to not return false negatives
 *
 * Based off this answer: https://stackoverflow.com/a/70710396/22324694

 * @param target object instance to decorate methods around
 */
function decorateClassMethodClone(target: ClassLike, clone: CloneFn) {
  /**
   * Ensure that the return values of all objects are cloned
   *
   * @param obj object whose method return values need to be cloned
   * @param key name of the method whose return values will be cloned
   */
  const decorateMethod = (obj: object, key: string | symbol): void => {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
    /* istanbul ignore next */
    if (!descriptor?.configurable) {
      return;
    }
    const value: unknown = descriptor.value;
    if (typeof value === "function" && value !== target) {
      descriptor.value = function (this: unknown, ...args: unknown[]) {
        return entityClone(Reflect.apply(value, this, args), clone);
      };
      Object.defineProperty(obj, key, descriptor);
    }
  };

  // Decorate static methods
  Object.getOwnPropertyNames(target)
    .filter((key) => !["length", "name", "prototype"].includes(key))
    .forEach((key) => {
      decorateMethod(target, key);
    });

  // Decorate instance methods
  Reflect.ownKeys(target.prototype)
    .filter((key) => key !== "constructor")
    .forEach((key) => {
      decorateMethod(target.prototype, key);
    });

  return target;
}

/**
 * Deeply clones a class object, preserving the prototype chain.
 * - Modified from https://stackoverflow.com/a/43753414/22324694
 *
 * @template T
 * @param {T} obj - The object to clone
 * @returns {T} - A deep clone of the input object
 * @throws {Error} - An unsupported data type is encountered
 */
/* istanbul ignore next */
const classClone = <T>(obj: T, objClone: CloneFn): T => {
  if (obj ?? typeof obj !== "object") {
    return decorateClassMethodClone(obj as ClassLike, objClone) as T;
  }
  const props = Object.getOwnPropertyDescriptors(obj);
  for (const prop of Object.keys(props)) {
    props[prop].value = classClone(props[prop].value, objClone);
  }
  return Object.create(Object.getPrototypeOf(obj), props);
};

/**
 * Helper function to clone functions or classes
 *
 * @param functionOrClass the functions or class to clone
 * @param objClone
 * @returns the cloned function or class
 */
const functionOrClassClone = (
  functionOrClass: FunctionOrClass,
  objClone: CloneFn,
): FunctionOrClass =>
  isFunction(functionOrClass)
    ? functionClone(functionOrClass as RuntimeFunction, objClone)
    : classClone(functionOrClass as ClassLike, objClone);

/**
 * Clones an entity for use with Jest expect.toStrictEqual
 *
 * @param entity the entity to clone, including variables/functions/classes
 * @param objClone custom function to clone objects/arrays
 * @returns the cloned entity
 */
function entityClone<T>(entity: T, objClone = objectClone): T {
  return typeof entity === "function"
    ? (functionOrClassClone(
        entity as unknown as FunctionOrClass,
        objClone,
      ) as T)
    : objClone(entity);
}

export default entityClone;
