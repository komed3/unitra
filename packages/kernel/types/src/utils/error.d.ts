import type { ErrorCode } from '@unitra/dict/utils';
import type { PluginResolveGraph } from '../core/plugin';
import type { SemverVersion } from './semver';

export interface ErrorCtxMap {
  [ ErrorCode.PLUGIN_ERROR ]: {
    graph: PluginResolveGraph;
    missing: ReadonlyArray< string >;
    conflicts: ReadonlyArray< string >;
    cycles: ReadonlyArray< string >;
    errCount: number;
  };
  [ ErrorCode.SEMVER_ERROR ]: {
    version: SemverVersion;
    semver: string;
    tag: string;
    parts: string[];
  }
}

export type ErrorContext< C extends ErrorCode > =
  C extends keyof ErrorCtxMap
    ? ErrorCtxMap[ C ]
    : never;

export type UnitraErrorOptions< C extends ErrorCode > =
  [ ErrorContext< C > ] extends [ never ]
    ? { cause?: unknown }
    : { context: ErrorContext< C >, cause?: unknown };

export type SerializedError = {
  name: string;
  code?: ErrorCode;
  message: string;
  summary?: string;
  stack?: string;
  context?: unknown;
  cause?: SerializedError;
};

export interface IUnitraError< C extends ErrorCode = ErrorCode > extends Error {
  readonly code?: C;
  readonly context?: ErrorContext< C >;
  readonly cause?: unknown;
  readonly type: string;
  readonly summary: string | undefined;
  toString: () => string;
  serialize: () => SerializedError;
  format: ( options?: ErrorFormatterConfig ) => string;
  log: () => void;
}

export type ErrorFormatterConfig = {
  showCode?: boolean;
  showSummary?: boolean;
  showContext?: boolean;
  showStack?: boolean;
  showCauses?: boolean;
  indent?: string;
};
