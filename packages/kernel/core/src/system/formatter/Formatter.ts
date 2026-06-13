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
      const isDenom = fraction && node.exp < 0;
      const exp = isDenom ? -node.exp : node.exp;
      const idx: 0 | 1 = isDenom ? 1 : 0;

      if ( node.type === 'factor' ) numeric[ idx ].push( { ...node, exp } );
      else structure[ idx ].push( { ...node, exp } );
    }

    return { numeric, structure };
  }

  public abstract out ( state: ReferenceState ) : string;
}
