import type { ErrorCode } from '@unitra/dict/utils';
import type { ReferenceState } from '../node';
import type { IUnitraError } from '../utils/error';
import type { RefOf, RegistryKey } from './registry';

export type GrammarToken< K extends RegistryKey = RegistryKey > = {
  ref: RefOf< K >;
  key: K;
  prefixable: boolean;
};

export type ParserGrammarMap< K extends RegistryKey = RegistryKey > = Map< string, GrammarToken< K > >;
export type ParserGrammar = { [ K in RegistryKey ]?: ParserGrammarMap< K > };

export type ParserIDToken = { type: 'identifier', value: string };
export type ParserCompoundToken = { type: 'compound', value: GrammarToken[] };
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

export type ResolvedToken =
  | ParserCompoundToken
  | ParserOPToken
  | ParserNumberToken
  | ParserLParenToken
  | ParserRParenToken;

export type AnyToken =
  | ParserToken
  | ResolvedToken;

export type ParsedFactor = {
  token: ParserIDToken | ParserCompoundToken | ParserNumberToken;
  exp: number;
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
