import { Program as ASTProgram } from 'meriyah/dist/src/estree';
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

export type JewireCallback = (
  rewireContext: ReturnType<typeof rewire>,
  hiddenExportInfo: HiddenExportInfo
) => void;

export type CloneFn = <T>(object: T) => T;

export interface Options {
  basePath?: string;
  objectClone?: CloneFn;
  callback?: JewireCallback;
}
