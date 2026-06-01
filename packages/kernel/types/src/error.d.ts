import { UnitraErrorCode } from '@unitra/dict/unitra';

export type UnitraErrorOptions = {
  code?: UnitraErrorCode;
  data?: unknown;
  cause?: unknown;
};
