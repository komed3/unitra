import type { IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, ReferenceState } from '@unitra/types/node';

export abstract class Formatter implements IFormatter {
  constructor ( protected readonly ctx: UnitraContext ) {}

  protected resolveNode ( node: Node ) {
    const res = {};

    for ( const [ k, val ] of Object.entries( node ) ) {
      if ( k in this.ctx.registry ) res[ k ] = this.resolveSymbol( k, val );
    }
  }

  public abstract format ( state: ReferenceState ) : string;
}
