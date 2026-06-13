import { Format } from '@unitra/dict/common';
import type { GroupedNodes, IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, NumericGroup, ReferenceState, StructureGroup } from '@unitra/types/node';
import { Logging } from '../../utils/logging';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected groupNodes ( nodes: Node[], fraction: boolean ) : GroupedNodes {
    const numeric: NumericGroup = [ [], [] ];
    const structure: StructureGroup = [ [], [] ];

    for ( const node of nodes ) {
      const neg = fraction && node.exp < 0;
      const exp = neg ? -node.exp : node.exp;

      if ( node.type === 'factor' ) numeric[ +neg ].push( { ...node, exp } );
      else structure[ +neg ].push( { ...node, exp } );
    }

    return { numeric, structure };
  }

  public abstract out ( state: ReferenceState ) : string;
}
