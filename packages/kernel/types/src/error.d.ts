import { UnitraErrorCode } from '@unitra/dict/unitra';

export type UnitraErrorOptions = {
  data?: unknown;
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

export interface IUnitraError extends Error {
  readonly code?: UnitraErrorCode;
  readonly data?: unknown;
  readonly cause?: unknown;
  readonly type: string;
  toString: () => string;
  serialize: () => SerializedError;
  format: ( options?: ErrorFormatterConfig ) => string;
  log: () => void;
}
