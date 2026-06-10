import type { ErrorCode } from '@unitra/dict/utils';
import type { ReferenceState } from '../node';
import type { IUnitraError } from '../utils/error';
import type { AnyRef, RegistryKey } from './registry';

export type ParserGrammar = Map< RegistryKey, Map< string, [ AnyRef, boolean ] > >;

export type ParserResult = {
  state: ReferenceState;
  input: unknown;
  error?: IUnitraError< ErrorCode.PARSER_ERROR >;
};

export interface IParser {
  parse ( input: unknown ) : ParserResult;
}

export type ParserAccessor = () => IParser;
