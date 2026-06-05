import type {
  AnyRef, IRegistry, RefOf, RegistryAccessor, RegistryDef,
  RegistryFactoryMap, RegistryInstanceMap, RegistryKey
} from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ConstantRef } from '@unitra/types/def/constant';
import type { PrefixRef } from '@unitra/types/def/prefix';
import type { QuantityRef } from '@unitra/types/def/quantity';
import type { UnitRef } from '@unitra/types/def/unit';

export class Registry< Ref extends AnyRef > implements IRegistry< Ref > {
  protected readonly store = new Map< Ref, RegistryDef< Ref > >();

  constructor ( private readonly ctx: UnitraContext ) {}

  public get size () : number {
    return this.store.size;
  }

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

export const createRegistryAccessor = (
  ctx: UnitraContext,
  factories?: Partial< RegistryFactoryMap >
) : RegistryAccessor => {
  const cache: Partial< RegistryInstanceMap > = {};

  const defaults: RegistryFactoryMap = {
    prefix: ( ctx ) => new Registry< PrefixRef >( ctx ),
    quantity: ( ctx ) => new Registry< QuantityRef >( ctx ),
    unit: ( ctx ) => new Registry< UnitRef >( ctx ),
    constant: ( ctx ) => new Registry< ConstantRef >( ctx )
  };

  return function get< K extends RegistryKey > ( key: K ) : RegistryInstanceMap[ K ] {
    return cache[ key ] ??= ( factories?.[ key ] ?? defaults[ key ] )( ctx );
  };
};

export const getTypedRegistry = < K extends RegistryKey > ( ctx: UnitraContext, key: K ) =>
  ctx.registry( key ) as unknown as IRegistry< RefOf< K > >;
