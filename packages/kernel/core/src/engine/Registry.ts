import type { AnyRef, IRegistry, RegistryDef } from '@unitra/types/core/registry';

export class Registry< Ref extends AnyRef > implements IRegistry< Ref > {
  protected readonly store = new Map< Ref, RegistryDef< Ref > >();

  public get < R extends Ref > ( ref: R ) : RegistryDef< R > | undefined {
    return this.store.get( ref ) as RegistryDef< R > | undefined;
  }

  public has ( ref: Ref ) : boolean {
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

  public keys () : IterableIterator< Ref > {
    return this.store.keys();
  }

  public values () : IterableIterator< RegistryDef< Ref > > {
    return this.store.values();
  }

  public filter ( predicate: ( def: RegistryDef< Ref > ) => boolean ) : RegistryDef< Ref >[] {
    return [ ...this.store.values() ].filter( predicate );
  }
}
