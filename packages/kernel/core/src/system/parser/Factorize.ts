import type { ParsedExpression, ParsedFactor, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Factorize {
  private static readonly log = Logging.createSource( 'parser::factorize' );

  constructor ( private readonly ctx: UnitraContext ) {}

  private parseExponent ( tokens: ParserToken[], pos: number ) : [ number, number ] {
    const token = tokens[ pos ];
    if ( ! token || token.type !== 'operator' || token.value !== '^' ) return [ 1, pos ];

    pos++;
    const value = tokens[ pos ];

    if ( ! value || value.type !== 'number' ) throw new ParserError(
      'expected exponent', { context: { position: pos } }
    );

    return [ value.value, pos + 1 ];
  }

  private parseGroup ( tokens: ParserToken[], pos: number, sign: number ) : [ ParsedFactor[], number ] {
    pos++;

    const [ factors, next ] = this.parseExpression( tokens, pos, sign );
    const end = tokens[ pos = next ];

    if ( ! end || end.type !== 'rparen' ) throw new ParserError(
      'expected closing parenthesis', { context: { position: pos } }
    );

    pos++;

    const [ exp, nextPos ] = this.parseExponent( tokens, pos );
    for ( const factor of factors ) factor.exp *= exp;
    return [ factors, nextPos ];
  }

  private parseFactor ( tokens: ParserToken[], pos: number, sign: number ) : [ ParsedFactor[], number ] {
    const token = tokens[ pos ];
    if ( ! token ) throw new ParserError( 'unexpected end of input', { context: { position: pos } } );

    if ( token.type === 'lparen' ) return this.parseGroup( tokens, pos, sign );
    if ( token.type !== 'identifier' && token.type !== 'number' ) throw new ParserError(
      'expected identifier or number', { context: { position: pos } }
    );

    const [ exp, next ] = this.parseExponent( tokens, pos + 1 );
    return [ [ { token, exp: exp * sign } ], next ];
  }

  private parseExpression ( tokens: ParserToken[], pos: number, sign: number ) : [ ParsedFactor[], number ] {
    const factors: ParsedFactor[] = [];

    let result = this.parseFactor( tokens, pos, sign );
    factors.push( ...result[ 0 ] );
    pos = result[ 1 ];

    while ( pos < tokens.length ) {
      const token = tokens[ pos ];

      if ( ! token || token.type === 'rparen' ) break;
      if ( token.type !== 'operator' || ( token.value !== '*' && token.value !== '/' ) ) break;

      const nextSign = token.value === '/' ? -sign : sign;
      result = this.parseFactor( tokens, pos + 1, nextSign );

      factors.push( ...result[ 0 ] );
      pos = result[ 1 ];
    }

    return [ factors, pos ];
  }

  public run ( tokens: ParserToken[] ) : ParsedExpression {
    const [ factors, pos ] = this.parseExpression( tokens, 0, 1 );
    const result: ParsedExpression = { factors };

    if ( pos !== tokens.length ) throw new ParserError(
      'unexpected trailing tokens', { context: { position: pos } }
    );

    this.ctx.hook().run( 'core.parser.factorize', { tokens, result } );
    Factorize.log.debug( `factorized ${ tokens.length } tokens into ${ factors.length } factors`, { result } );

    return result;
  }
}
