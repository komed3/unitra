import type { ParsedExpression, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Factorize {
  private static readonly log = Logging.createSource( 'parser::factorize' );

  constructor ( private readonly ctx: UnitraContext ) {}

  public run ( tokens: ParserToken[] ) : ParsedExpression {
    const result: ParsedExpression = { factors: [] };

    return result;
  }
}
