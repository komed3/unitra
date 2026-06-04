import type { ErrorCode } from '@unitra/dict/utils';

export type UnitraErrorOptions< T extends unknown = never > =
  [ T ] extends [ never ]
    ? { cause?: unknown }
    : { data: T, cause?: unknown };

export type SerializedError = {
  name: string;
  code?: ErrorCode;
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

export interface IUnitraError< C extends ErrorCode = ErrorCode, T extends unknown = never > extends Error {
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
