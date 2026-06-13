import { Format, Lang } from '@unitra/dict/common';
import type { Meta } from '@unitra/types/common';
import type {
  FormatterOptions, FormatterRenderer, GroupedNodes, IFormatter, NumberPartRenderer, PreparedState,
  ResolvedGroupedNodes, ResolvedNode, ResolvedNumber, ResolvedState
} from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { IAssert } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState, StructureNode } from '@unitra/types/node';
import { FormatterError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  protected get defaults () : FormatterOptions {
    return {
      numeric: {
        notation: 'standard',
        scientificStyle: 'e'
      },
      deprecated: 'warn',
      fraction: false,
      sep: {
        factor: ' ',
        exp: '*',
        node: ' '
      }
    };
  };

  protected get numberRenderer () : NumberPartRenderer {
    return {
      integer: part => part.value,
      group: part => part.value,
      decimal: part => part.value,
      fraction: part => part.value,
      plusSign: part => part.value,
      minusSign: part => part.value,
      literal: part => part.value,
      nan: part => part.value,
      infinity: part => part.value,
      compact: part => part.value,

      exponentInteger: ( part, opt ) =>
        this.renderer.superscript( part.value, opt ),

      exponentMinusSign: ( part, opt ) =>
        this.renderer.superscript( part.value, opt ),

      exponentSeparator: ( part, opt ) =>
        opt.numeric?.scientificStyle === 'power'
          ? `${ opt.sep?.exp }10^`
          : part.value,

      scientific: part => part.value,
      sign: part => part.value
    };
  };

  protected get renderer () : FormatterRenderer {
    return {
      superscript: value => value,

      numberPart: ( part, opt ) => {
        const r = this.numberRenderer[ part.type as keyof NumberPartRenderer ];
        return r ? r( part, opt ) : part.value;
      },

      number: ( num, opt ) =>
        num.map( p => this.renderer.numberPart( p, opt ) ).join( '' ),

      exponent: ( exp, opt ) => {
        const num = this.renderer.number( exp, opt );
        return num === '1' ? '' : '^' + this.renderer.superscript( num, opt );
      },

      symbol: node => node.symbol,
      prefix: node => node.prefix ?? '',

      node: ( node, opt ) =>
        this.renderer.prefix( node, opt ) +
        this.renderer.symbol( node, opt ) +
        this.renderer.exponent( node.exp, opt ),

      factor: ( factor, opt ) =>
        factor?.length
          ? this.renderer.number( factor ?? [], opt )
          : '',

      numerator: ( nodes, opt ) =>
        nodes
          .map( n => this.renderer.node( n, opt ) )
          .join( opt.sep?.node ),

      denominator: ( nodes, opt ) =>
        nodes
          .map( n => this.renderer.node( n, opt ) )
          .join( opt.sep?.node ),

      fraction: ( num, den ) => den.length ? `${ num } / ${ den }` : num,

      state: ( factor, structure, opt ) =>
        factor.length && structure.length
          ? `${ factor }${ opt.sep?.factor }${ structure }`
          : factor || structure || ''
    };
  };

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected options ( opt?: FormatterOptions ) : FormatterOptions {
    return {
      ...this.defaults, ...opt,
      numeric: { ...this.defaults.numeric, ...opt?.numeric },
      filter: { ...this.defaults.filter, ...opt?.filter }
    };
  }

  protected resolveMeta < K extends RegistryKey > ( key: K, ref: RefOf< K > ) : Meta {
    const meta = getTypedRegistry( this.ctx, key ).get( ref )?.meta;

    if ( ! meta ) throw new FormatterError(
      `failed to resolve meta for ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    return meta;
  }

  protected resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K >, opt: FormatterOptions = {} ) : string {
    const { lang, filter = {}, deprecated } = opt;
    const meta = this.resolveMeta( key, ref );

    if ( ! meta.symbol.length ) throw new FormatterError(
      `no symbol defined for ${ key } reference "${ ref }"`,
      { context: { key, ref } }
    );

    const filtered = meta.symbol.filter( ( { id, context } ) =>
      ( filter.symbols?.[ key ]?.[ ref ] ? filter.symbols?.[ key ]?.[ ref ] === id : true ) &&
      ( ! context?.system || ( filter.system ? context.system.includes( filter.system ) : true ) ) &&
      ( ! context?.lang || ( lang ? context.lang === lang : true ) )
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

    return this.ctx.hook().run(
      'core.formatter.symbol', { key, ref, meta, options: opt },
      symbol.format[ this.format ] ?? symbol.format.plain
    );
  }

  protected resolveNumber ( factor?: number, opt: FormatterOptions = {} ) : ResolvedNumber {
    return this.ctx.hook().run( 'core.formatter.number', { factor, options: opt }, factor
      ? Intl.NumberFormat( opt.lang ?? Lang.EN, {
        notation: opt.numeric?.notation,
        minimumFractionDigits: opt.numeric?.precision,
        maximumFractionDigits: opt.numeric?.precision,
        signDisplay: opt.numeric?.sign,
        roundingMode: opt.numeric?.rounding,
        useGrouping: opt.numeric?.grouping
      } ).formatToParts( factor )
      : []
    );
  }

  protected resolveNode ( node: StructureNode, opt: FormatterOptions = {} ) : ResolvedNode {
    const res = { type: node.type, exp: this.resolveNumber( node.exp ) } as ResolvedNode;

    if ( 'constant' in node ) res.symbol = this.resolveSymbol( 'constant', node.constant, opt );
    if ( 'unit' in node ) res.symbol = this.resolveSymbol( 'unit', node.unit, opt );
    if ( 'prefix' in node && node.prefix ) res.prefix = this.resolveSymbol( 'prefix', node.prefix, opt );

    return res;
  }

  protected resolveGroupedNodes ( nodes: GroupedNodes, opt: FormatterOptions = {} ) : ResolvedGroupedNodes {
    return nodes.map( g => g.map( n => this.resolveNode( n, opt ) ) ) as ResolvedGroupedNodes;
  }

  protected prepare ( state: ReferenceState, fraction?: boolean, factor?: number ) : PreparedState {
    const prepared: PreparedState = { nodes: [ [], [] ], factor };

    for ( const node of state.nodes ) {
      if ( node.type === 'factor' ) {
        if ( prepared.factor === undefined ) prepared.factor = 1;
        prepared.factor *= Math.pow( node.value, node.exp );
      } else {
        if ( fraction && node.exp < 0 ) prepared.nodes[ 1 ].push( { ...node, exp: -node.exp } );
        else prepared.nodes[ 0 ].push( { ...node } );
      }
    }

    this.ctx.hook().run( 'core.formatter.prepare', { state, prepared, fraction, factor } );
    return prepared;
  }

  protected resolve ( prepared: PreparedState, opt: FormatterOptions = {} ) : ResolvedState {
    const resolved: ResolvedState = {
      nodes: this.resolveGroupedNodes( prepared.nodes, opt ),
      factor: prepared.factor ? this.resolveNumber( prepared.factor, opt ) : undefined
    };

    this.ctx.hook().run( 'core.formatter.resolve', { prepared, resolved, options: opt } );
    return resolved;
  }

  protected render ( state: ResolvedState, opt: FormatterOptions = {} ) : string {
    const factor = this.renderer.factor( state.factor, opt );
    const num = this.renderer.numerator( state.nodes[ 0 ], opt );
    const den = this.renderer.denominator( state.nodes[ 1 ], opt );
    const structure = this.renderer.fraction( num, den, opt );
    const out = this.renderer.state( factor, structure, opt ).trim();

    return this.ctx.hook().run( 'core.formatter.render', { state, options: opt }, out );
  }

  public out ( state: ReferenceState, options?: FormatterOptions, value?: number ) : string {
    const assert: IAssert = this.ctx.service.assert();
    assert.assertState( state );

    const resolvedOptions = this.options( options );
    const prepared = this.prepare( state, resolvedOptions.fraction, value );
    const resolved = this.resolve( prepared, resolvedOptions );
    return this.render( resolved, resolvedOptions );
  }
}
