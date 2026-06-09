import type { ParserResult, TokenCache } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Parser {
  private tokenCache: TokenCache | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  public parse ( input: string ) : ParserResult {
    return { state: { nodes: [] } };
  }
}
