import { Format } from '@unitra/dict/common';
import type { Meta } from '@unitra/types/common';
import type { FilterOptions, FormatterNode, FormatterOptions, IFormatter } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, ReferenceState } from '@unitra/types/node';
import { FormatterError } from '../../utils/error';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  protected readonly format: Format = Format.PLAIN;

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected resolveMeta < K extends RegistryKey > ( key: K, ref: RefOf< K > ) : Meta {
    const meta = getTypedRegistry( this.ctx, key ).get( ref )?.meta;

    if ( ! meta ) throw new FormatterError(
      `failed to resolve meta for ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    return meta;
  }

  protected resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K >, opt: FilterOptions = {} ) : string {
    const meta = this.resolveMeta( key, ref );

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

  protected resolveFactor ( val: number ) : string {
    return String( val );
  }

  protected resolveNode ( node: Node, opt: FormatterOptions = {} ) : FormatterNode {
    const res = { exp: node.exp } as FormatterNode;

    if ( 'constant' in node )
      res.symbol = this.resolveSymbol( 'constant', node.constant, opt.filter );
    else if ( 'unit' in node )
      res.symbol = this.resolveSymbol( 'unit', node.unit, opt.filter );

    if ( 'prefix' in node && node.prefix )
      res.prefix = this.resolveSymbol( 'prefix', node.prefix, opt.filter );

    if ( node.type === 'factor' )
      res.factor = this.resolveFactor( node.value );

    return res;
  }

  public out ( state: ReferenceState, options?: FormatterOptions ) : string {
    return this.ctx.hook().run( 'core.formatter.format', { state, options }, '' );
  }
}
