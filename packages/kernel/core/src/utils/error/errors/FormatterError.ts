import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class FormatterError extends UnitraError< ErrorCode.FORMATTER_ERROR > {
  public override readonly code = ErrorCode.FORMATTER_ERROR;
}
