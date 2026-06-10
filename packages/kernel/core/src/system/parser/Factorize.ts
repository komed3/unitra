import type { ParsedExpression, ParsedFactor, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Factorize {
  private static readonly log = Logging.createSource( 'parser::factorize' );

  constructor ( private readonly ctx: UnitraContext ) {}

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
    Factorize.log.debug( `factorized ${ tokens.length } tokens into ${ result.factors.length } factors`, { result } );

    return result;
  }
}
