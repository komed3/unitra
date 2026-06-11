import type { ParserCompoundToken, ParserToken, ResolvedToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';
import type { Grammar } from './Grammar';

export class Resolve {
  private static readonly log = Logging.createSource( 'parser::resolve' );

  constructor (
    private readonly ctx: UnitraContext,
    private readonly grammar: Grammar
  ) {}

  private resolveIdentifier ( value: string, tokens: ParserToken[], index: number ) : ParserCompoundToken {
    Resolve.log.debug( `resolving identifier "${ value }" ...` );

    const u = this.grammar.find( 'unit', value );
    if ( u ) return { type: 'compound', value: [ u ] };

    const c = this.grammar.find( 'constant', value );
    if ( c ) return { type: 'compound', value: [ c ] };
  }

  public run ( tokens: ParserToken[] ) : ResolvedToken[] {}
}
