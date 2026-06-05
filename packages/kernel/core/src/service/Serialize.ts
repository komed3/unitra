export class Serialize {
  private static readonly map = {
    factor: ( node ) => ( { order: 0, value: `#${ node.value }` } ),
    constant: ( node ) => ( { order: 1, value: `@${ node.constant }^${ node.exp }` } ),
    unit: ( node ) => ( { order: 2, value: `${ node.prefix ? `${ node.prefix }:` : '' }${ node.unit }^${ node.exp }` } )
  } as const;
}
