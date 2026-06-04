import type { UnitraErrorCode } from '@unitra/dict/error';
import type { HookCtx, HookId, HookValue } from '../core/hook';
import type { PluginResolveGraph } from '../core/plugin';
import type { LikeOf, RegistryKey } from '../core/registry';
import type { SemverVersion } from './semver';

export type UnitraErrorOptions< T = unknown > = {
  data?: T;
  cause?: unknown;
};

export type SerializedError = {
  name: string;
  code?: UnitraErrorCode;
  message: string;
  summary?: string;
  stack?: string;
  data?: unknown;
  cause?: SerializedError;
};

export type ErrorFormatterConfig = {
  showCode?: boolean;
  showSummary?: boolean;
  showData?: boolean;
  showStack?: boolean;
  showCauses?: boolean;
  indent?: string;
};

export interface IUnitraError< C extends UnitraErrorCode = UnitraErrorCode, T = unknown > extends Error {
  readonly code?: C;
  readonly data?: T;
  readonly cause?: unknown;
  readonly type: string;
  readonly summary: string | undefined;
  toString: () => string;
  serialize: () => SerializedError;
  format: ( options?: ErrorFormatterConfig ) => string;
  log: () => void;
}

export type AssertError = IUnitraError< UnitraErrorCode.ASSERT_ERROR, {
  key: RegistryKey;
  value: unknown;
} >;

export type HookRunError< K extends HookId > = IUnitraError< UnitraErrorCode.HOOK_RUN_ERROR, {
  id: K;
  ctx: HookCtx< K >;
  value?: HookValue< K >;
} >;

export type PluginResolutionError = IUnitraError< UnitraErrorCode.PLUGIN_RESOLUTION_ERROR, {
  graph: PluginResolveGraph;
  missing: ReadonlyArray< string >;
  conflicts: ReadonlyArray< string >;
  cycles: ReadonlyArray< string >;
  errCount: number;
} >;

export type ResolveError< K extends RegistryKey > = IUnitraError< UnitraErrorCode.RESOLVE_ERROR, {
  key: RegistryKey;
  value: LikeOf< K >;
} >;

export type SemverError = IUnitraError< UnitraErrorCode.SEMVER_ERROR, {
  version: SemverVersion;
  semver: string;
  tag: string;
  parts: string[];
} >;
