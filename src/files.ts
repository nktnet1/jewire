import fs from 'fs';
import path from 'path';
import { parse } from 'meriyah';
import { VALID_FILE_EXTENSIONS } from './config';
import { ASTProgram, HiddenExportInfo } from './types';

/**
 * Get the file path of the caller function.
 *
 * Implementation inspired by:
 * - https://www.npmjs.com/package/callsite?activeTab=code
 *
 * @returns {string} absolute path or an empty string if no caller
 */
export const getCallerFilePath = (): string => {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const err = new Error();
  Error.captureStackTrace(err, getCallerFilePath);
  const stack = err.stack as any;
  Error.prepareStackTrace = orig;
  return stack[1].getFileName();
};

/**
 * Find the module file path by checking for available extensions
 * as defined by VALID_FILE_EXTENSIONS
 *
 * @param {string} modulePath - The path to the module
 * @param {string} basePath - The base path for the module
 * @returns {string} The resolved file path
 * @throws {Error} If the file is not found
 */
export const findModuleFile = (modulePath: string, basePath: string): string => {
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
 * Retrieves the name of all global variables/functions/classes, including
 * those not exported in the file
 *
 * @param {string} filePath - The path to the JavaScript module file
 * @returns {HiddenExportInfo} - Object of string[] for hidden exports
 * @throws {Error} If the module file is empty or cannot be parsed.
 */
export const getModuleHiddenExports = (filePath: string): HiddenExportInfo => {
  const code = fs.readFileSync(filePath, 'utf-8');
  if (code.length === 0) {
    throw new Error(`Module '${filePath}' is an empty file`);
  }
  let ast: ASTProgram;
  try {
    ast = parse(code);
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
for errors: ${error}`
    );
  }

  const variables: string[] = [];
  const functions: string[] = [];
  const classes: string[] = [];

  ast.body.forEach((node) => {
    if (node.type === 'FunctionDeclaration') {
      functions.push(node.id!.name);
    } else if (node.type === 'VariableDeclaration') {
      node.declarations.forEach((declaration) => {
        if (declaration.id.type === 'Identifier') {
          variables.push(declaration.id.name);
        }
      });
    } else if (node.type === 'ClassDeclaration' && node.id) {
      classes.push(node.id.name);
    }
  });

  return { exports: { functions, variables, classes }, ast, code };
};
