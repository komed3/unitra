import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import { ParserToken } from '@unitra/types/core/parser';

export class Tokenize {
  private static readonly log = Logging.createSource( 'parser::tokenize' );
  private static readonly ALPHA = /^\p{L}$/u;
  private static readonly SUPER = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g;

  private static readonly SUPER_MAP = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
    '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+'
  } as const;

  private static readonly OPERATOR_MAP = {
    '*': '*', '×': '*', '·': '*', '/': '/', '^': '^'
  } as const;

  private static readonly NATURAL_MAP = {
    'per': '/', 'over': '/', 'square': '^2', 'squared': '^2',
    'cube': '^3', 'cubed': '^3', 'reciprocal': '^-1'
  } as const;

  private static readonly NUMBER_MOD = [
    '.', 'e', '+', '-'
  ] as const;

  constructor ( private readonly ctx: UnitraContext ) {}

  private isWhitespace ( c: string ) : boolean {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r';
  }

  private isDigit ( c: string ) : boolean {
    return c >= '0' && c <= '9';
  }

  private isAlpha ( c: string ) : boolean {
    return Tokenize.ALPHA.test( c );
  }

  private normalizeSuperscript ( input: string ) : string {
    return input.replace( Tokenize.SUPER, match =>
      '^' + [ ...match ].map( c =>
        Tokenize.SUPER_MAP[ c as keyof typeof Tokenize.SUPER_MAP ]
      ).join( '' )
    );
  }

  private readIdentifier ( input: string, start: number ) : [ string, number ] {
    let pos = start;

    while ( pos < input.length && (
      this.isAlpha( input[ pos ] ) ||
      this.isDigit( input[ pos ] )
    ) ) pos++;

    return [ input.slice( start, pos ), pos ];
  }

  private readNumber ( input: string, start: number ) : [ number, number ] {
    let pos = start;

    if ( input[ pos ] === '+' || input[ pos ] === '-' ) pos++;

    while ( pos < input.length && (
      this.isDigit( input[ pos ] ) ||
      Tokenize.NUMBER_MOD.includes( input[ pos ] as typeof Tokenize.NUMBER_MOD[ number ] )
    ) ) pos++;

    const raw = input.slice( start, pos );
    const value = Number( raw );

    if ( Number.isNaN( value ) ) throw new ParserError(
      `invalid number "${ raw }"`, { context: { input, position: start } }
    );

    return [ value, pos ];
  }

  private pushOperator ( tokens: ParserToken[], value: string ) : boolean {
    const mapped = Tokenize.NATURAL_MAP[ value.toLowerCase() as keyof typeof Tokenize.NATURAL_MAP ];
    if ( ! mapped ) return false;

    if ( mapped.startsWith( '^' ) ) {
      tokens.push( { type: 'operator', value: '^' } );
      tokens.push( { type: 'number', value: Number( mapped.slice( 1 ) ) } );
    } else {
      tokens.push( { type: 'operator', value: mapped as '*' | '/' | '^' } );
    }

    return true;
  }
}
