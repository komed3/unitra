import type { UnitraErrorCode } from '@unitra/dict/error';
import type { HookCtx, HookId, HookValue } from '../core/hook';
import type { PluginResolveGraph } from '../core/plugin';

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

export type AssertDefError = IUnitraError< UnitraErrorCode.ASSERT_DEF_ERROR, {
  value: unknown;
} >;

export type AssertRefError = IUnitraError< UnitraErrorCode.ASSERT_REF_ERROR, {
  value: unknown;
} >;

export type HookRunnerError< K extends HookId > = IUnitraError< UnitraErrorCode.HOOK_RUNNER_ERROR, {
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
