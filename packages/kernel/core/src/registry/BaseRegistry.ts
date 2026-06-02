export abstract class BaseRegistry< Ref extends string, Def > {
  protected readonly store = new Map< Ref, Def >();

  constructor () {}

  public get < R extends Ref > ( ref: R ) : Def | undefined {
    return this.store.get( ref );
  }

  public has ( ref: Ref ) : boolean {
    return this.store.has( ref );
  }
}
