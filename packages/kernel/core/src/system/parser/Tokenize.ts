import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

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
}
