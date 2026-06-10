import type { ParsedExpression, ParsedFactor, ParserToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class StructureParser {
  private pos: number = 0;

  constructor (
    private readonly ctx: UnitraContext,
    private readonly tokens: ParserToken[]
  ) {}

  private parseExpression ( divide: boolean ) : ParsedFactor[] {
    return [];
  }

  public run () : ParsedExpression {
    return { factors: this.parseExpression( false ) };
  }
}
