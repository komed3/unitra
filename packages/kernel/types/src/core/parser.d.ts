import type { ErrorCode } from '@unitra/dict/utils';
import type { UnitRef } from '../def/unit';
import type { ReferenceState } from '../node';
import type { IUnitraError } from '../utils/error';
import type { AnyRef, RegistryKey } from './registry';

export type GrammarToken< R extends AnyRef = AnyRef > = {
  ref: R;
  prefixable: R extends UnitRef ? boolean : false;
};

export type ParserGrammarMap< R extends AnyRef = AnyRef > = Map< string, GrammarToken< R > >;
export type ParserGrammar = Map< RegistryKey, ParserGrammarMap >;

export type ParserResult = {
  state: ReferenceState;
  input: unknown;
  error?: IUnitraError< ErrorCode.PARSER_ERROR >;
};

export interface IParser {
  parse ( input: unknown ) : ParserResult;
}

export type ParserAccessor = () => IParser;
