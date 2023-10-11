import { CloneFn } from './types';

/**
 * Checks if the provided value is a JavaScript function or a class constructor.
 * You should first check that `typeof functionOrClass === 'function'`
 *
 * @param {any} functionOrClass - value known to be either a function or class
 * @returns {boolean} - `true` if the value is a function, false if it is a class
 */
export const isFunction = (functionOrClass: any): boolean => {
  const propertyNames = Object.getOwnPropertyNames(functionOrClass);
  return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
};

/**
 * Deep clones an object or array, creating a new object with the
 * same structure and values.
 *
 * @param {T} obj - The object or array to deep clone.
 * @returns {T} - A deep clone of the input object or array.
 */
const objectClone: CloneFn = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const cloneArr: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      cloneArr[i] = objectClone(obj[i]);
    }
    return cloneArr as any as T;
  }

  const cloneObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = objectClone(obj[key]);
    }
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
const functionClone = <T extends (...args: any[]) => any>(fn: T, clone: CloneFn) => (
  ...args: Parameters<T>
): ReturnType<T> => {
  const result = fn(...args);
  return result && typeof result === 'object' ? clone(result) : result;
};

/**
 * For each of the method in the class, apply function/object clone at run time
 * for Jest expect.toStrictEqual to not return false negatives
 *
 * Based off this answer: https://stackoverflow.com/a/70710396/22324694

 * @param target object instance to decorate methods around
 */
function decorateClassMethodClone(target: any, clone: CloneFn) {
  /**
   * Ensure that the return values of all objects are cloned
   *
   * @param obj object whose method return values need to be cloned
   * @param key name of the method whose return values will be cloned
   */
  const decorateMethod = (obj: Record<string, any>, key: string | symbol): void => {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
    /* istanbul ignore next */
    if (!descriptor?.configurable) {
      return;
    }
    const { value } = descriptor;
    if (typeof value === 'function' && value !== target) {
      descriptor.value = function (...args: any[]) {
        return entityClone(value.apply(this, args), clone);
      };
      Object.defineProperty(obj, key, descriptor);
    }
  };

  // Decorate static methods
  Object.getOwnPropertyNames(target)
    .filter((key) => !['length', 'name', 'prototype'].includes(key))
    .forEach(key => decorateMethod(target, key));

  // Decorate instance methods
  Reflect.ownKeys(target.prototype)
    .filter(key => key !== 'constructor')
    .forEach(key => decorateMethod(target.prototype, key));

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
  if (obj === null || typeof obj !== 'object') {
    return decorateClassMethodClone(obj as any, objClone);
  }
  const props = Object.getOwnPropertyDescriptors(obj);
  for (const prop in props) {
    if (Object.prototype.hasOwnProperty.call(props, prop)) {
      props[prop].value = classClone(props[prop].value, objClone);
    }
  }
  return Object.create(
    Object.getPrototypeOf(obj),
    props
  );
};

/**
 * Helper function to clone functions or classes
 *
 * @param functionOrClass the functions or class to clone
 * @param objClone
 * @returns the cloned function or class
 */
const functionOrClassClone = (functionOrClass: any, objClone: CloneFn) =>
  isFunction(functionOrClass)
    ? functionClone(functionOrClass, objClone)
    : classClone(functionOrClass, objClone);

/**
 * Clones an entity for use with Jest expect.toStrictEqual
 *
 * @param entity the entity to clone, including variables/functions/classes
 * @param objClone custom function to clone objects/arrays
 * @returns the cloned entity
 */
function entityClone(entity: any, objClone = objectClone) {
  return typeof entity === 'function'
    ? functionOrClassClone(entity, objClone)
    : objClone(entity);
}

export default entityClone;
