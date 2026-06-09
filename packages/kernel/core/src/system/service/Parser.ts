import type { ParserResult } from '@unitra/types/core/service';

export class Parser {
  public parse ( input: string ) : ParserResult {
    return { state: { nodes: [] } };
  }
}
