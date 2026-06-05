import type { ErrorCode } from '@unitra/dict/utils';
import type { PluginResolveGraph } from '../core/plugin';
import type { LikeOf } from '../core/registry';
import type { SemverVersion } from './semver';

export interface ErrorCtxMap< T = unknown > {
  [ ErrorCode.ASSERT_ERROR ]: {
    key: T;
    value: unknown;
  };
  [ ErrorCode.PLUGIN_ERROR ]: {
    graph: PluginResolveGraph;
    missing: ReadonlyArray< string >;
    conflicts: ReadonlyArray< string >;
    cycles: ReadonlyArray< string >;
    errCount: number;
  };
  [ ErrorCode.RESOLVE_ERROR ]: {
    key: T;
    value: LikeOf< T >;
  };
  [ ErrorCode.SEMVER_ERROR ]: {
    version: SemverVersion;
    semver: string;
    tag: string;
    parts: string[];
  };
}

export type ErrorContext< C extends ErrorCode, T = unknown > =
  C extends keyof ErrorCtxMap
    ? ErrorCtxMap< T >[ C ]
    : never;

export type UnitraErrorOptions< C extends ErrorCode = ErrorCode, T = unknown > =
  [ ErrorContext< C, T > ] extends [ never ]
    ? { cause?: unknown }
    : { context: ErrorContext< C, T >, cause?: unknown };

export type SerializedError = {
  name: string;
  code?: ErrorCode;
  message: string;
  summary?: string;
  stack?: string;
  context?: unknown;
  cause?: SerializedError;
};

export interface IUnitraError<
  C extends ErrorCode = ErrorCode,
  T = unknown
> extends Error {
  readonly code?: C;
  readonly context?: ErrorContext< C, T >;
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
