import { Format } from '@unitra/dict/common';
import type { IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { Node, NodeGroups, ReferenceState } from '@unitra/types/node';
import { Logging } from '../../utils/logging';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  constructor ( protected readonly ctx: UnitraContext ) {}

  protected groupNodes ( nodes: Node[], fraction: boolean ) : NodeGroups {
    const groups: NodeGroups = [ [], [] ];

    for ( const node of nodes ) {
      if ( fraction && node.exp < 0 ) groups[ 1 ].push( { ...node, exp: -node.exp } );
      else groups[ 0 ].push( { ...node } );
    }

    return groups;
  }

  public abstract out ( state: ReferenceState ) : string;
}
