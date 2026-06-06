import type { AnyRef, IRegistry, RegistryDef } from '@unitra/types/core/registry';
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
}
