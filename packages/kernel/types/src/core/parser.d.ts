import type { ErrorCode } from '@unitra/dict/utils';
import type { ReferenceState } from '../node';
import type { IUnitraError } from '../utils/error';

export type ParserResult = {
  state: ReferenceState;
  input: unknown;
  error?: IUnitraError< ErrorCode.PARSER_ERROR >;
};

export interface IParser {
  parse ( input: unknown ) : ParserResult;
}

export type ParserAccessor = () => IParser;
