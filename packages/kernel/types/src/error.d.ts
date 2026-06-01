import { UnitraErrorCode } from '@unitra/dict/error';

export type UnitraErrorOptions< T = unknown > = {
  data?: T;
  cause?: unknown;
};

export type SerializedError = {
  name: string;
  code?: UnitraErrorCode;
  message: string;
  stack?: string;
  data?: unknown;
  cause?: SerializedError;
};

export type ErrorFormatterConfig = {
  showCode?: boolean;
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
  toString: () => string;
  serialize: () => SerializedError;
  format: ( options?: ErrorFormatterConfig ) => string;
  log: () => void;
}

export type PluginResolutionError = IUnitraError< UnitraErrorCode.PLUGIN_RESOLUTION_ERROR, {
  missing: ReadonlyArray< string >;
  conflicts: ReadonlyArray< string >;
  cycles: ReadonlyArray< string >;
  errCount: number;
} >;
