import type { ParsedExpression, ParsedFactor, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';

export class StructureParser {
  private pos: number = 0;

  constructor (
    private readonly ctx: UnitraContext,
    private readonly tokens: ParserToken[]
  ) {}

  private throwErr ( msg: string ) : never {
    throw new ParserError( msg, { context: { position: this.pos } } );
  }

  private current () : ParserToken | undefined {
    return this.tokens[ this.pos ];
  }

  private consume () : ParserToken {
    const token = this.tokens[ this.pos++ ];
    if ( ! token ) this.throwErr( 'unexpected end of input' );

    return token;
  }

  private parseFactor ( divide: boolean ) : ParsedFactor[] {
    const token = this.current();
    if ( ! token ) this.throwErr( 'unexpected end of input' );

    if ( token.type === 'lparen' )
      return this.parseGroup( divide );

    if ( token.type !== 'identifier' && token.type !== 'number' )
      this.throwErr( 'expected identifier or number' );

    this.consume();
    return [ { divide, exp: this.parseExponent(), token } ];
  }

  private parseExpression ( divide: boolean ) : ParsedFactor[] {
    const factors = [ ...this.parseFactor( divide ) ];

    while ( true ) {
      const token = this.current();

      if ( ! token || token.type === 'rparen' ) break;
      if ( token.type !== 'operator' || ( token.value !== '*' && token.value !== '/' ) ) break;

      this.consume();
      factors.push( ...this.parseFactor( token.value === '/' ) );
    }

    return factors;
  }

  public run () : ParsedExpression {
    return { factors: this.parseExpression( false ) };
  }
}
