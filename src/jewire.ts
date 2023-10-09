/* eslint-disable no-eval */

import fs from 'fs';
import path from 'path';
import { VariableDeclarator, File as BabelFile } from '@babel/types';
import { ParseResult, parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import callsite from 'callsite';

export type EntityCollection = Record<string, any>;

const VALID_FILE_EXTENSIONS = Object.freeze(['.js', '.ts', '.cjs', '.mjs']);

/**
 * Converts a function into a jewirified function.

 * A jewirified function is one where arrays and objects are repacked at
 * run-time with the spread operator (...) such that the `.toStrictEqual`
 * matcher can accurately compare.
 *
 * The function is based on the workaround listed here:
 * - https://stackoverflow.com/q/76007003/22324694
 *
 * @param {T} fn - The function to jewirify
 * @returns {ReturnType<T>} The jewirified function
 */
const jewirify = <T extends (...args: any[]) => any>(fn: T) => (
  ...args: Parameters<T>
): ReturnType<T> => {
  const result = fn(...args);
  return result && typeof result === 'object'
    ? (Array.isArray(result) ? [...result] : { ...result })
    : result;
};

/**
 * Find the module file path by checking for available extensions:
 * - [.ts, .js, .cjs, .mjs]
 *
 * @param {string} modulePath - The path to the module
 * @param {string} basePath - The base path for the module
 * @returns {string} The resolved file path
 * @throws {Error} If the file is not found
 */
const findModuleFile = (modulePath: string, basePath: string): string => {
  const filePathOriginal = path.join(basePath, modulePath);
  let filePath = filePathOriginal;
  if (!path.extname(filePathOriginal)) {
    for (const ext of VALID_FILE_EXTENSIONS) {
      filePath = path.join(basePath, `${modulePath}${ext}`);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
  }
  if (!fs.existsSync(filePath)) {
    const noExt = filePath.replace(/\.[^/.]+$/, '');
    throw new Error(
      `No such file '${noExt}' with matching extensions [${VALID_FILE_EXTENSIONS}]`
    );
  }
  return filePath;
};

/**
 * Parse the JavaScript code from the given file path. If a TypeScript file
 * is given, it will be automatically transpiled.
 *
 * @param {string} filePath - The file path to read
 * @returns {string} The transpiled JavaScript code
 * @throws {Error} If there's an issue reading the file
 */
const getJSTranspiledCode = (filePath: string): string => {
  let code: string;
  try {
    code = fs.readFileSync(filePath, 'utf-8');
    if (path.extname(filePath) === '.ts') {
      const ts = require('typescript');
      code = ts.transpileModule(code, { compilerOptions: {} }).outputText;
    }
    if (code.length === 0) {
      throw new Error('file is empty!');
    }
  } catch (error) {
    throw new Error(`Error reading ${filePath}: ${error}`);
  }
  return code;
};

/**
 * Add variable entities to the provided entities object. Variables that
 * were assigned to anonymous functions will be automatically jewerified.
 *
 * @param {EntityCollection} entities - The entities object to update
 * @param {VariableDeclarator} declarator - The VariableDeclarator node
 */
const addVariableEntityCollection = (
  entities: EntityCollection, declarator: VariableDeclarator
) => {
  if (declarator.id && declarator.init && declarator.id.type === 'Identifier') {
    const code = generate(declarator.init).code;
    let evalResult: any;
    try {
      evalResult = eval(`(${code})`);
    } catch (error) {
      // console.log(error);
    }
    if (typeof evalResult === 'function') {
      entities[declarator.id.name] = jewirify(evalResult);
    } else {
      entities[declarator.id.name] = evalResult;
    }
  }
};

/**
 * Create entities from the provided Babel Abstract Syntax Tree (AST).
 *
 * @param {ParseResult<BabelFile>} ast - The Babel AST to process.
 * @returns {Entity} The entities object.
 */
const createEntityCollection = (ast: ParseResult<BabelFile>): EntityCollection => {
  const entities: EntityCollection = {};
  traverse(ast, {
    enter(path) {
      if (path.node.type === 'VariableDeclaration') {
        path.node.declarations.forEach((declarator) => {
          addVariableEntityCollection(entities, declarator);
        });
      } else if (path.node.type === 'FunctionDeclaration') {
        if (path.node.id && path.node.id.name) {
          const functionCode = generate(path.node).code;
          entities[path.node.id.name] = jewirify(eval(`(${functionCode})`));
        }
      }
    },
  });
  return entities;
};

/**
 * Jewire a module and return its hidden variables and functions
 *
 * @param {string} modulePath - The path to the module.
 * @param {string} [basePath] - defaults to __dirname of caller
 * @returns {Entity} The exported entities from the module.
 * @throws {Error} if no valid files are found, or if there are syntax errors
 */
const jewire = (
  modulePath: string, basePath?: string
): EntityCollection => {
  if (basePath === undefined) {
    const stack = callsite();
    basePath = path.dirname(stack[1].getFileName());
  }
  const filePath = findModuleFile(modulePath, basePath);
  const code = getJSTranspiledCode(filePath);
  try {
    const ast = parse(code, { sourceType: 'module' });
    return createEntityCollection(ast);
  } catch (error) {
    throw new Error(
`>>> Failed to parse code:
===============================================================================
${filePath}
===============================================================================

${code}

=============================================
Please double check the file:
    ${filePath}
for errors: ${(error as any).stack}`
    );
  }
};

export default jewire;
