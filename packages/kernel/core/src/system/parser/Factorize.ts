import type { ParsedExpression, ParsedFactor, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Factorize {
  private static readonly log = Logging.createSource( 'parser::factorize' );

  constructor ( private readonly ctx: UnitraContext ) {}

  private parseExpression ( tokens: ParserToken[], pos: number, sign: number ) : [ ParsedFactor[], number ] {}

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
