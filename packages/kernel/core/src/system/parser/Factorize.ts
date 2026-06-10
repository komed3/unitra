import type { ParsedExpression, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Factorize {
  private static readonly log = Logging.createSource( 'parser::factorize' );

  constructor ( private readonly ctx: UnitraContext ) {}

  public run ( tokens: ParserToken[] ) : ParsedExpression {
    const result: ParsedExpression = { factors: [] };

    this.ctx.hook().run( 'core.parser.factorize', { tokens, result } );
    Factorize.log.debug( `factorized ${ tokens.length } tokens into ${ result.factors.length } factors`, { result } );

    return result;
  }
}
