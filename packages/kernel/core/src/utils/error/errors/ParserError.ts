import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class ParserError extends UnitraError< ErrorCode.PARSER_ERROR > {
  public override readonly code = ErrorCode.PARSER_ERROR;
}
