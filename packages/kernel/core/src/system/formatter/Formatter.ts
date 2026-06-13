import { Format, Lang } from '@unitra/dict/common';
import type { FormatterOptions, IFormatter, ProcessedNodes } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState } from '@unitra/types/node';
import { Logging } from '../../utils/logging';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  protected readonly defaults: FormatterOptions = {
    fraction: false
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

  public out ( state: ReferenceState, options?: FormatterOptions, value?: number ) : string {
    const resolvedOptions = this.options( options );
    const { nodes, factor } = this.prepare( state, resolvedOptions.fraction, value );
    const resolvedFactor = this.resolveNumber( factor, resolvedOptions );

    return this.ctx.hook().run( 'core.formatter.format', { state, options }, '' );
  }
}
