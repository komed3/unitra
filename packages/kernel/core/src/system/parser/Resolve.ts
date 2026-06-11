import type { ParserToken, ResolvedToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';
import type { Grammar } from './Grammar';

export class Resolve {
  private static readonly log = Logging.createSource( 'parser::resolve' );

  constructor (
    private readonly ctx: UnitraContext,
    private readonly grammar: Grammar
  ) {}

  public run ( tokens: ParserToken[] ) : ResolvedToken[] {}
}
