import path from 'path';
import rewire from 'rewire';
import entityClone from './clone';
import { Options } from './types';
import { findModuleFile, getCallerFilePath, getModuleHiddenExports } from './files';

/**
 * Leverages rewire to extract hidden exports from a JavaScript module, but
 * allowing named exports in the same style as require.
 * Returned objects and arrays are also deep-cloned such that they can be
 * tested with .toStrictEqual() in Jest, although introduces limitations
 *
 * @param {string} relativePath - the name or path of the module, e.g. ./arrays
 * @param {Options} [options] - options for jewire as defined in types.ts
 * @returns {Record<string, any>} - Named exports from the file
 */
const jewire = (relativePath: string, options: Options = {}): Record<string, any> => {
  const filePath = findModuleFile(
    relativePath,
    options.basePath ?? path.dirname(getCallerFilePath())
  );
  const hiddenExportInfo = getModuleHiddenExports(filePath);
  const hiddenExports = Object.values(hiddenExportInfo.symbols).flat();
  const rewiredModule = rewire(filePath);

  const rewireContext = {
    ...rewiredModule,
    __get__: (name: string) => entityClone(rewiredModule.__get__(name), options.objectClone),
  };

  const entities: Record<string, any> = {};
  for (const hiddenExport of hiddenExports) {
    entities[hiddenExport] = rewireContext.__get__(hiddenExport);
  }

  if (options.callback) {
    options.callback(rewireContext, hiddenExportInfo);
  }

  return entities;
};

export default jewire;
