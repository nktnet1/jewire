import rewire from 'rewire';
import entityClone from './clone';
import { JewireEntities, Options } from './types';
import { findModuleFile, getCallerDirname, getModuleHiddenExports } from './files';

/**
 * Leverages rewire to extract hidden exports from a JavaScript module, but
 * allowing named exports in the same style as require.
 * Returned objects and arrays are also deep-cloned such that they can be
 * tested with .toStrictEqual() in Jest, although introduces limitations
 *
 * @param {string} relativePath - the name or path of the module, e.g. ./arrays
 * @param {Options} [options] - options for jewire as defined in types.ts
 * @returns {JewireEntities} - Named exports from the file
 */
const jewire = (relativePath: string, options: Options = {}): JewireEntities => {
  const filePath = findModuleFile(
    options.basePath ?? getCallerDirname(),
    relativePath
  );
  const hiddenExportInfo = getModuleHiddenExports(filePath);
  const hiddenExports = Object.values(hiddenExportInfo.symbols).flat();
  const rewireModule = rewire(filePath);

  const jewireGetter = (name: string) => entityClone(rewireModule.__get__(name), options.objectClone);

  const entities: JewireEntities = {
    __jewireContext__: {
      rewire: rewireModule,
      hiddenExportInfo,
      jewireGetter,
    }
  };
  for (const hiddenExport of hiddenExports) {
    entities[hiddenExport] = jewireGetter(hiddenExport);
  }

  return entities;
};

export default jewire;
