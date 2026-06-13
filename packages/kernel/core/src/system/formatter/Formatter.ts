import { Format } from '@unitra/dict/common';
import type { FormatterOptions, IFormatter, PreprocessedNodes } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState } from '@unitra/types/node';
import { Logging } from '../../utils/logging';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected preprocess ( state: ReferenceState, fraction: boolean, factor?: number ) : PreprocessedNodes {
    const res: PreprocessedNodes = { nodes: [ [], [] ], factor };

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

  public out ( state: ReferenceState, options?: FormatterOptions, value?: number ) : string {
    const { nodes, factor } = this.preprocess( state, options?.fraction ?? true, value );

    return this.ctx.hook().run( 'core.formatter.format', { state, options }, '' );
  }
}
