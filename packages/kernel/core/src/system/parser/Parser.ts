import type { IParser, ParserResult } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Parser implements IParser {
  constructor ( private readonly ctx: UnitraContext ) {}

  public parse ( input: unknown ) : ParserResult {
    const result: ParserResult = { input, state: { nodes: [] } };
    return result;
  }
}
