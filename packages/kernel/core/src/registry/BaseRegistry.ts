export abstract class BaseRegistry< Ref extends string, Def > {
  protected readonly store = new Map< Ref, Def >();

  constructor () {}

  public get < R extends Ref > ( ref: R ) : Def | undefined {
    return this.store.get( ref );
  }

  public has ( ref: Ref ) : boolean {
    return this.store.has( ref );
  }

  public set < R extends Ref > ( ref: R, def: Def ) : void {
    this.store.set( ref, def );
  }

  public bulk ( input: Iterable< [ Ref, Def ] > ) : void {
    for ( const [ ref, def ] of input ) this.store.set( ref, def );
  }
}
