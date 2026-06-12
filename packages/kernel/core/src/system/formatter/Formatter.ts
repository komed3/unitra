import { Format } from '@unitra/dict/common';
import type { FilterOptions, IFormatter } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, ReferenceState } from '@unitra/types/node';
import { FormatterError } from '../../utils/error';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  protected readonly format: Format = Format.PLAIN;

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected resolveMeta 

  protected resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K >, opt: FilterOptions = {} ) : string {
    const meta = getTypedRegistry( this.ctx, key ).get( ref )?.meta;

    if ( ! meta ) throw new FormatterError(
      `failed to resolve ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    if ( ! meta.symbol.length ) throw new FormatterError(
      `no symbol defined for ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    const filtered = meta.symbol.filter( ( { id, context } ) =>
      ( opt.symbols?.[ key ]?.[ ref ] ? opt.symbols?.[ key ]?.[ ref ] === id : true ) &&
      ( ! context?.system || ( opt.system ? context.system.includes( opt.system ) : true ) ) &&
      ( ! context?.lang || ( opt.lang ? context.lang === opt.lang : true ) )
    );

    const symbol = filtered.find( s => s.canonical ) ?? filtered[ 0 ] ??
      meta.symbol.find( s => s.canonical ) ?? meta.symbol[ 0 ];

    return symbol.format[ this.format ] ?? symbol.format.plain;
  }

  protected resolveNode ( node: Node ) {
    const res: any = {};

    for ( const [ k, val ] of Object.entries( node ) ) {
      if ( k in this.ctx.registry ) res[ k ] = this.resolveSymbol( k as RegistryKey, val );
    }
  }

  public abstract out ( state: ReferenceState ) : string;
}
