import { Format } from '@unitra/dict/common';
import type { Meta } from '@unitra/types/common';
import type { FormatterNode, FormatterOptions, IFormatter, NumericOptions } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, ReferenceState } from '@unitra/types/node';
import { FormatterError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
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

  protected resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K >, opt: FormatterOptions = {} ) : string {
    const { filter = {}, deprecated = 'warn' } = opt;
    const meta = this.resolveMeta( key, ref );

    if ( ! meta.symbol.length ) throw new FormatterError(
      `no symbol defined for ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    const filtered = meta.symbol.filter( ( { id, context } ) =>
      ( filter.symbols?.[ key ]?.[ ref ] ? filter.symbols?.[ key ]?.[ ref ] === id : true ) &&
      ( ! context?.system || ( filter.system ? context.system.includes( filter.system ) : true ) ) &&
      ( ! context?.lang || ( filter.lang ? context.lang === filter.lang : true ) )
    );

    const symbol = filtered.find( s => s.canonical ) ?? filtered[ 0 ] ??
      meta.symbol.find( s => s.canonical ) ?? meta.symbol[ 0 ];

    if ( symbol.deprecated ) {
      if ( deprecated === 'warn' ) Formatter.log.warn(
        `using deprecated symbol "${ symbol.id }" for ${ key } reference "${ ref }"`
      );

      if ( deprecated === 'throw' ) throw new FormatterError(
        `symbol "${ symbol.id }" for ${ key } reference "${ ref }" is deprecated`,
        { context: { key, ref, symbol } }
      );
    }

    return symbol.format[ this.format ] ?? symbol.format.plain;
  }

  protected resolveFactor ( val: number, opt: NumericOptions = {} ) : string {
    return String( val );
  }

  protected resolveNode ( node: Node, opt: FormatterOptions = {} ) : FormatterNode {
    const res = { exp: node.exp } as FormatterNode;

    if ( 'constant' in node )
      res.symbol = this.resolveSymbol( 'constant', node.constant, opt );
    else if ( 'unit' in node )
      res.symbol = this.resolveSymbol( 'unit', node.unit, opt );

    if ( 'prefix' in node && node.prefix )
      res.prefix = this.resolveSymbol( 'prefix', node.prefix, opt );

    if ( node.type === 'factor' )
      res.factor = this.resolveFactor( node.value, opt.numeric );

    return res;
  }

  protected resolveState ( state: ReferenceState, opt: FormatterOptions = {} ) : FormatterNode[] {
    const res: FormatterNode[] = [];
    for ( const node of state.nodes ) res.push( this.resolveNode( node, opt ) );
    return res;
  }

  public abstract out ( state: ReferenceState ) : string;
}
