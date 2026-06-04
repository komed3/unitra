import type { ConstantRef } from '@unitra/types/constant';
import type { PrefixRef } from '@unitra/types/prefix';
import type { QuantityRef } from '@unitra/types/quantity';
import type { AnyRef, IRegistry, RefOf, RegistryAccessor, RegistryDef, RegistryInstanceMap, RegistryKey } from '@unitra/types/registry';
import type { UnitRef } from '@unitra/types/unit';
import type { UnitraContext } from '@unitra/types/unitra';

export class Registry< Ref extends AnyRef > implements IRegistry< Ref > {
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

  public filter ( predicate: ( def: RegistryDef< Ref > ) => boolean ) : RegistryDef< Ref >[] {
    return [ ...this.store.values() ].filter( predicate );
  }
}

export const createRegistryAccessor = ( override?: Partial< RegistryInstanceMap > ) : RegistryAccessor => {
  const cache: Partial< RegistryInstanceMap > = {};

  const factories: { [ K in RegistryKey ]: () => RegistryInstanceMap[ K ] } = {
    unit: () => new Registry< UnitRef >(),
    prefix: () => new Registry< PrefixRef >(),
    quantity: () => new Registry< QuantityRef >(),
    constant: () => new Registry< ConstantRef >()
  };

  return function get < K extends RegistryKey > ( key: K ) : RegistryInstanceMap[ K ] {
    return ( override?.[ key ] ?? cache[ key ] ?? ( cache[ key ] = factories[ key ]() ) );
  };
};

export const getTypedRegistry = < K extends RegistryKey > ( ctx: UnitraContext, key: K ) =>
  ctx.registry( key ) as unknown as IRegistry< RefOf< K > >;
