import type { AnyRef, IRegistry, RegistryContent, RegistryDef, RegistryEntries } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { RegistryStorage } from './RegistryStorage';

export class Registry< Ref extends AnyRef > implements IRegistry< Ref > {
  private readonly items = new RegistryStorage< Ref >();

  constructor ( private readonly ctx: UnitraContext ) {}

  public get size () : number {
    return this.items.size;
  }

  public get < R extends Ref > ( ref: R ) : RegistryDef< R > | undefined {
    return this.items.get( ref );
  }

  public has ( ref: Ref ) : boolean {
    return this.items.has( ref );
  }

  public set < R extends Ref > ( ref: R, def: RegistryDef< R > ) : void {
    this.items.set( ref, def );
  }

  public bulk ( input: RegistryContent< Ref > | RegistryEntries< Ref > ) : void {
    const entries = ( Symbol.iterator in Object( input ) ? input : Object.entries( input ) ) as RegistryEntries< Ref >;
    for( const [ ref, def ] of entries ) this.items.set( ref, def );
  }

  public entries () : IterableIterator< [ Ref, RegistryDef< Ref > ] > {
    return this.items.entries();
  }

  public keys () : IterableIterator< Ref > {
    return this.items.keys();
  }

  public values () : IterableIterator< RegistryDef< Ref > > {
    return this.items.values();
  }

  public filter ( predicate: ( def: RegistryDef< Ref > ) => boolean ) : RegistryDef< Ref >[] {
    return [ ...this.items.values() ].filter( predicate );
  }
}
