import { Format, Lang } from '@unitra/dict/common';
import type { FormatterOptions, IFormatter, ProcessedNodes, ResolvedNode } from '@unitra/types/core/formatter';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState, StructureNode } from '@unitra/types/node';
import { Logging } from '../../utils/logging';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  protected readonly defaults: FormatterOptions = {
    numeric: { notation: 'standard', scientificStyle: 'e' },
    deprecated: 'warn', fraction: false
  };

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected options ( opt?: FormatterOptions ) : FormatterOptions {
    return {
      ...this.defaults, ...opt,
      numeric: { ...this.defaults.numeric, ...opt?.numeric },
      filter: { ...this.defaults.filter, ...opt?.filter }
    };
  }

  protected prepare ( state: ReferenceState, fraction?: boolean, factor?: number ) : ProcessedNodes {
    const res: ProcessedNodes = { nodes: [ [], [] ], factor };

    for ( const node of state.nodes ) {
      if ( node.type === 'factor' ) {
        if ( res.factor === undefined ) res.factor = 1;
        res.factor *= Math.pow( node.value, node.exp );
      } else {
        if ( fraction && node.exp < 0 ) res.nodes[ 1 ].push( { ...node, exp: -node.exp } );
        else res.nodes[ 0 ].push( { ...node } );
      }
    }

    return res;
  }

  protected resolveNumber ( factor?: number, opt: FormatterOptions = {} ) : Intl.NumberFormatPart[] {
    return ! factor ? [] : Intl.NumberFormat( opt.lang ?? Lang.EN, {
      notation: opt.numeric?.notation,
      minimumFractionDigits: opt.numeric?.precision,
      maximumFractionDigits: opt.numeric?.precision,
      signDisplay: opt.numeric?.sign,
      roundingMode: opt.numeric?.rounding,
      useGrouping: opt.numeric?.grouping
    } ).formatToParts( factor );
  }

  protected resolveSymbol < K extends RegistryKey > ( key: K, ref: RefOf< K >, opt: FormatterOptions = {} ) : string {}

  protected resolveNode ( node: StructureNode, opt: FormatterOptions = {} ) : ResolvedNode {
    const res = { type: node.type, exp: node.exp } as ResolvedNode;

    if ( 'constant' in node ) res.symbol = this.resolveSymbol( 'constant', node.constant, opt );
    if ( 'unit' in node ) res.symbol = this.resolveSymbol( 'unit', node.unit, opt );
    if ( 'prefix' in node && node.prefix ) res.prefix = this.resolveSymbol( 'prefix', node.prefix, opt );

    return res;
  }

  public out ( state: ReferenceState, options?: FormatterOptions, value?: number ) : string {
    const resolvedOptions = this.options( options );
    const { nodes, factor } = this.prepare( state, resolvedOptions.fraction, value );
    const resolvedFactor = this.resolveNumber( factor, resolvedOptions );

    return this.ctx.hook().run( 'core.formatter.format', { state, options }, '' );
  }
}
