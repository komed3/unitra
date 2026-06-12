import type { ErrorCode } from '@unitra/dict/utils';
import type { Symbol } from '../common';
import type { HookId } from '../core/hook';
import type { AnyToken } from '../core/parser';
import type { PluginResolveGraph } from '../core/plugin';
import type { AnyRef, InputOf, RegistryKey } from '../core/registry';
import type { NodeType } from '../node';
import type { SemverVersion } from './semver';

export interface ErrorRegistry {
  [ ErrorCode.ASSERT_ERROR ]: {
    key: RegistryKey;
    value: unknown;
  } | {
    value: unknown;
    type?: NodeType;
  };
  [ ErrorCode.FORMATTER_ERROR ]: {
    key?: RegistryKey;
    ref?: AnyRef;
    symbol?: Symbol;
  };
  [ ErrorCode.HOOK_ERROR ]: {
    id: HookId;
    hookCtx: unknown;
    value?: unknown;
  };
  [ ErrorCode.INIT_ERROR ]: {};
  [ ErrorCode.PLUGIN_RESOLVE_ERROR ]: {
    graph: PluginResolveGraph;
    missing: ReadonlyArray< string >;
    conflicts: ReadonlyArray< string >;
    cycles: ReadonlyArray< string >;
    overrides: ReadonlyArray< string >;
    errCount: number;
  };
  [ ErrorCode.REGISTRY_ERROR ]: {
    ref: AnyRef;
  };
  [ ErrorCode.RESOLVE_ERROR ]: {
    key: RegistryKey;
    value: InputOf< RegistryKey >;
  };
  [ ErrorCode.SEMVER_ERROR ]: {
    version: SemverVersion;
    semver: string;
    tag: string;
    parts: string[];
  };
  [ ErrorCode.PARSER_ERROR ]: {
    input?: unknown;
    position?: number;
    tokens?: AnyToken[];
  };
  [ ErrorCode.VERSION_ERROR ]: {
    version: number;
  };
}

export type ErrorContext< C extends ErrorCode > =
  C extends keyof ErrorRegistry
    ? ErrorRegistry[ C ]
    : never;

export type UnitraErrorOptions< C extends ErrorCode = ErrorCode > =
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
  readonly context?: ErrorContext< C >;
  readonly cause?: unknown;
  readonly type: string;
  readonly summary: string | undefined;
  toString () : string;
  serialize () : SerializedError;
  format ( options?: ErrorFormatterConfig ) : string;
  log () : void;
}
