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

export type UnitraErrorOptions< T extends unknown = {} > = {
  context?: T;
  cause?: unknown;
};

export type SerializedError = {
  name: string;
  code?: ErrorCode;
  message: string;
  summary?: string;
  stack?: string;
  context?: unknown;
  cause?: SerializedError;
};

export type ErrorFormatterConfig = {
  showCode?: boolean;
  showSummary?: boolean;
  showContext?: boolean;
  showStack?: boolean;
  showCauses?: boolean;
  indent?: string;
};

export interface IUnitraError< C extends ErrorCode = ErrorCode > extends Error {
  readonly code?: C;
  readonly context: C extends keyof ErrorCtxMap ? ErrorCtxMap[ C ]: never;
  readonly cause?: unknown;
  readonly type: string;
  readonly summary: string | undefined;
  toString: () => string;
  serialize: () => SerializedError;
  format: ( options?: ErrorFormatterConfig ) => string;
  log: () => void;
}
