import type { ParserGrammar } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';

export class Grammar {
  private cache: ParserGrammar | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  private populateGrammarCache () : ParserGrammar {}

  public get grammar () : ParserGrammar {
    return this.cache ??= this.populateGrammarCache();
  }
}
