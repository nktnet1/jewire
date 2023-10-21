import fs from 'fs';
import path from 'path';
import { parse } from 'meriyah';
import { VALID_FILE_EXTENSIONS } from './config';
import { HiddenExportInfo, Symbols } from './types';
import { Statement } from 'meriyah/dist/src/estree';

/**
 * Get the file path of the caller function.
 *
 * Implementation inspired by:
 * - https://www.npmjs.com/package/callsite?activeTab=code
 *
 * @returns {string} absolute path or an empty string if no caller
 */
export const getCallerDirname = (): string => {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const err = new Error();
  Error.captureStackTrace(err, getCallerDirname);
  const stack = err.stack as any;
  Error.prepareStackTrace = orig;
  const callerFilePath = stack[1].getFileName();
  /* istanbul ignore next */
  return path.dirname(
    callerFilePath.startsWith('file://')
      ? callerFilePath.substring(7)
      : callerFilePath
  );
};

/**
 * Find the module file path by checking for available extensions
 * as defined by VALID_FILE_EXTENSIONS
 *
 * @param {string} filePath The absolute path to the file
 * @returns {string} The resolved file path with appended extension
 * @throws {Error} If the file path does not match any valid extensions
 */
const findFileWithExtensions = (filePath: string): string => {
  for (const ext of VALID_FILE_EXTENSIONS) {
    const extFilePath = `${filePath}${ext}`;
    if (fs.existsSync(extFilePath)) {
      return extFilePath;
    }
  }
  throw new Error(
    `No such file '${filePath}' with matching extensions [${VALID_FILE_EXTENSIONS}]`
  );
};

/**
 * Find the module file path
 *
 * @param {string} modulePath - The path to the module
 * @param {string} basePath - The base path for the module
 * @returns {string} The resolved file path
 * @throws {Error} If the file is not found
 */
export const findModuleFile = (basePath: string, modulePath: string): string => {
  const filePath = path.join(basePath, modulePath);
  return fs.existsSync(filePath) ? filePath : findFileWithExtensions(filePath);
};

/**
 * Appends the name of the node given to the appropriate symbol
 *
 * @param node - a node from the Abstract Syntaxt Tree
 * @param symbols - object containing three arrays: functions/classes/variables
 * @returns symbols consisting of variables, functions and classes
 */
const retrieveSymbolsFromAst = (node: Statement, symbols: Symbols): void => {
  switch (node.type) {
    case 'VariableDeclaration':
      node.declarations.forEach((declaration) => {
        if (declaration.id.type === 'Identifier') {
          symbols.variables.push(declaration.id.name);
        }
      });
      break;
    case 'FunctionDeclaration':
      if (node.id !== null) {
        symbols.functions.push(node.id.name);
      }
      break;
    case 'ClassDeclaration':
      if (node.id !== null) {
        symbols.classes.push(node.id.name);
      }
      break;
    default:
      break;
  }
};

/**
 * Parses code from a file and generates an Abstract Syntax Tree (AST)
 *
 * @param {string} filePath - The absolute path to the file
 * @throws {Error} If the file is empty or contains errors while parsing
 * @returns {Object} object with properties:
 * - `ast` (ASTProgram): The Abstract Syntax Tree (AST) representing the code
 * - `code` (string): The original code read from the file
 */
const createAbstractSyntaxTree = (filePath: string) => {
  const code = fs.readFileSync(filePath, 'utf-8');
  if (code.length === 0) {
    throw new Error(`Module '${filePath}' is an empty file`);
  }
  try {
    return { ast: parse(code), code };
  } catch (error: any) {
    throw new Error(
`>>> Failed to parse code:
===============================================================================
${filePath}
===============================================================================

${code}

=============================================
Please double check the file:
    ${filePath}
for the error: ${error}`
    );
  }
};

/**
 * Retrieves the name of all global variables/functions/classes, including
 * those not exported in the file
 *
 * @param {string} filePath - The path to the JavaScript module file
 * @returns {HiddenExportInfo} - Object of string[] for hidden exports
 * @throws {Error} If the module file is empty or cannot be parsed.
 */
export const getModuleHiddenExports = (filePath: string): HiddenExportInfo => {
  const symbols = {
    variables: [],
    functions: [],
    classes: [],
  };
  const { ast, code } = createAbstractSyntaxTree(filePath);
  for (const node of ast.body) {
    retrieveSymbolsFromAst(node, symbols);
  }
  return { symbols, ast, code };
};
