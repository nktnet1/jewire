// eslint-disable-next-line import/no-unresolved
import { Program as ASTProgram } from 'meriyah/dist/types/estree';
import rewire from 'rewire';

export type { ASTProgram };

export interface Symbols {
  functions: string[];
  variables: string[];
  classes: string[];
}

export interface HiddenExportInfo {
  symbols: Symbols;
  ast: ASTProgram;
  code: string;
}

export type CloneFn = <T>(object: T) => T;

export interface Options {
  basePath?: string;
  objectClone?: CloneFn;
}

export interface JewireEntities {
  __jewireContext__: {
    rewire: ReturnType<typeof rewire>;
    hiddenExportInfo: HiddenExportInfo;
    jewireGetter: (name: string) => any;
  };

  [key: string]: any;
}
