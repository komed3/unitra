import type { ParsedExpression, ParsedFactor, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';

export class StructureParser {
  private pos: number = 0;

  constructor (
    private readonly ctx: UnitraContext,
    private readonly tokens: ParserToken[]
  ) {}

  private current () : ParserToken | undefined {
    return this.tokens[ this.pos ];
  }

  private consume () : ParserToken {
    const token = this.tokens[ this.pos++ ];

    if ( ! token ) throw new ParserError( 'unexpected end of input',
      { context: { parserToken: token, position: this.pos } }
    );

    return token;
  }

  private parseExpression ( divide: boolean ) : ParsedFactor[] {
    return [];
  }

  public run () : ParsedExpression {
    return { factors: this.parseExpression( false ) };
  }
}
