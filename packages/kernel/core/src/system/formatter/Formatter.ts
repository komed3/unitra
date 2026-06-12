import type { IFormatter } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, ReferenceState } from '@unitra/types/node';
import { FormatterError } from '../../utils/error';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  constructor ( protected readonly ctx: UnitraContext ) {}

  protected resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K > ) {
    const meta = getTypedRegistry( this.ctx, key ).get( ref )?.meta;
    if ( ! meta ) throw new FormatterError( `failed to resolve symbol: ${ key }/${ ref }`, { context: {} } );
  }

  protected resolveNode ( node: Node ) {
    const res: any = {};

    for ( const [ k, val ] of Object.entries( node ) ) {
      if ( k in this.ctx.registry ) res[ k ] = this.resolveSymbol( k as RegistryKey, val );
    }
  }

  public abstract format ( state: ReferenceState ) : string;
}
