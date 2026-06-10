import type { ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
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

  private pushNatural ( tokens: ParserToken[], value: string ) : boolean {
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

  private validateParentheses ( tokens: ParserToken[], input: string ) : void {
    let depth = 0;

    for ( const token of tokens ) {
      if ( token.type === 'lparen' ) depth++;
      else if ( token.type === 'rparen' ) {
        depth--;

        if ( depth < 0 ) throw new ParserError(
          'unexpected closing parenthesis', { context: { input } }
        );
      }
    }

    if ( depth !== 0 ) throw new ParserError(
      'unbalanced parentheses', { context: { input } }
    );
  }

  private insertImplicitMultiplication ( tokens: ParserToken[] ) : void {
    const endsValue = ( t: ParserToken ) =>
      t.type === 'identifier' ||
      t.type === 'number' ||
      t.type === 'rparen';

    const startsValue = ( t: ParserToken ) =>
      t.type === 'identifier' ||
      t.type === 'number' ||
      t.type === 'lparen';

    for ( let i = 0; i < tokens.length; i++ ) {
      const current = tokens[ i ], next = tokens[ i + 1 ];

      if ( next && endsValue( current ) && startsValue( next ) ) {
        tokens.splice( i + 1, 0, { type: 'operator', value: '*' } );
        i++;
      }
    }
  }

  public run ( input: string ) : ParserToken[] {
    input = this.normalizeSuperscript( input );

    const tokens: ParserToken[] = [];
    let pos = 0;

    while ( pos < input.length ) {
      const c = input[ pos ];

      if ( this.isWhitespace( c ) ) { pos++; continue }
      if ( c === '(' ) { tokens.push( { type: 'lparen' } ); pos++; continue }
      if ( c === ')' ) { tokens.push( { type: 'rparen' } ); pos++; continue }

      if ( c in Tokenize.OPERATOR_MAP ) {
        tokens.push( { type: 'operator', value: Tokenize.OPERATOR_MAP[
          c as keyof typeof Tokenize.OPERATOR_MAP
        ] } );

        pos++;
        continue;
      }

      if ( this.isDigit( c ) || (
        ( c === '+' || c === '-' || c === '.' ) &&
        pos + 1 < input.length &&
        this.isDigit( input[ pos + 1 ] )
      ) ) {
        const [ value, next ] = this.readNumber( input, pos );
        tokens.push( { type: 'number', value } );

        pos = next;
        continue;
      }

      if ( this.isAlpha( c ) ) {
        const [ value, next ] = this.readIdentifier( input, pos );

        if ( ! this.pushNatural( tokens, value ) )
          tokens.push( { type: 'identifier', value } );

        pos = next;
        continue;
      }

      throw new ParserError(
        `unexpected character "${ c }" at position ${ pos }`,
        { context: { input, position: pos } }
      );
    }

    this.validateParentheses( tokens, input );
    this.insertImplicitMultiplication( tokens );

    this.ctx.hook().run( 'core.parser.tokenize', { input, tokens } );
    Tokenize.log.debug( `tokenized input into ${ tokens.length } tokens`, { tokens } );

    return tokens;
  }
}
