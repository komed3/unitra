import type { ParsedFactor } from '@unitra/types/core/parser';
import type { ConstantRef } from '@unitra/types/def/constant';
import type { PrefixRef } from '@unitra/types/def/prefix';
import type { UnitRef } from '@unitra/types/def/unit';
import type { Node } from '@unitra/types/node';
import { ParserError } from '../../utils/error';

export class NodeBuilder {
  public static toNode ( term: ParsedFactor ) : Node {
    const { token, exp } = term;

    if ( token.type === 'number' ) return {
      type: 'factor', value: token.value, exp
    };

    if ( token.type !== 'compound' ) throw new ParserError(
      `unresolved identifier "${ token.value }"`,
      { context: { tokens: [ token ] } }
    );

    const [ { key, ref }, prefix ] = token.value.reverse();
    if ( key === 'constant' ) return {
      type: 'constant', constant: ref as ConstantRef, exp
    };

    else return {
      type: 'unit', unit: ref as UnitRef, exp,
      prefix: prefix ? prefix.ref as PrefixRef : undefined
    };
  }

  public static toNodes ( factors: ParsedFactor[] ) : Node[] {
    const out: Node[] = [];
    for ( const f of factors ) out.push( this.toNode( f ) );
    return out;
  }
}
