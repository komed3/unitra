import { UnitraErrorCode } from '@unitra/dict/unitra';

export type UnitraErrorOptions = {
  code?: UnitraErrorCode;
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
