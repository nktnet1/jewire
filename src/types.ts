import type { Program as ASTProgram } from "meriyah/dist/types/estree";
import type rewire from "rewire";

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
export type RewireEntity = ReturnType<ReturnType<typeof rewire>["__get__"]>;

export interface Options {
  basePath?: string;
  objectClone?: CloneFn;
}

export type JewireEntities<
  TPrivate extends object = Record<string, RewireEntity>,
> = TPrivate & {
  __jewireContext__: {
    rewire: ReturnType<typeof rewire>;
    hiddenExportInfo: HiddenExportInfo;
    jewireGetter: <K extends Extract<keyof TPrivate, string>>(
      name: K,
    ) => TPrivate[K];
  };
};
