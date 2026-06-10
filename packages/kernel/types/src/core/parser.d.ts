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

export type ParserIDToken = { type: 'identifier', value: string };
export type ParserOPToken = { type: 'operator', value: '*' | '/' | '^' };
export type ParserNumberToken = { type: 'number', value: number };
export type ParserLParenToken = { type: 'lparen' };
export type ParserRParenToken = { type: 'rparen' };

export type ParserToken =
  | ParserIDToken
  | ParserOPToken
  | ParserNumberToken
  | ParserLParenToken
  | ParserRParenToken;

export type ParsedFactor = {
  token: ParserIDToken | ParserNumberToken;
  exp: number;
};

export type ParsedExpression = {
  factors: ParsedFactor[];
};

export type ParserResult = {
  state: ReferenceState;
  input: unknown;
  error?: IUnitraError< ErrorCode.PARSER_ERROR >;
};

export interface IParser {
  parse ( input: unknown ) : ParserResult;
}

export type ParserAccessor = () => IParser;
