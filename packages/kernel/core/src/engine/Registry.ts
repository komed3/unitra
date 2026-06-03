import { AnyRef, RegistryDef } from '@unitra/types/registry';

export class Registry< Ref extends AnyRef > {
  protected readonly store = new Map< Ref, RegistryDef< Ref > >();

  public get size () : number {
    return this.store.size;
  }

  public get < R extends Ref > ( ref: R ) : RegistryDef< R > | undefined {
    return this.store.get( ref ) as RegistryDef< R > | undefined;
  }

  public has < R extends Ref > ( ref: R ) : boolean {
    return this.store.has( ref );
  }

  public set < R extends Ref > ( ref: R, def: RegistryDef< R > ) : void {
    this.store.set( ref, def );
  }

  public bulk ( input: Iterable< [ Ref, RegistryDef< Ref > ] > ) : void {
    for ( const [ ref, def ] of input ) this.store.set( ref, def );
  }

  public entries () : IterableIterator< [ Ref, RegistryDef< Ref > ] > {
    return this.store.entries();
  }

  public values () : IterableIterator< RegistryDef< Ref > > {
    return this.store.values();
  }

  public keys () : IterableIterator< Ref > {
    return this.store.keys();
  }
}
