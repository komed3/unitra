import type { AnyRef, RegistryDef } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { RegistryError } from '../../utils/error';

export class RegistryStorage< Ref extends AnyRef > extends Map< Ref, RegistryDef< Ref > > {
  private revId: number = 0;

  constructor ( private readonly ctx: UnitraContext ) {
    super();
  }

  public get revision () : number {
    return this.revId;
  }

  public override set < R extends Ref > ( key: R, value: RegistryDef< R > ) : this {
    if ( super.has( key ) ) throw new RegistryError(
      `registry already has a definition for reference "${ key }".`,
      { context: { ref: key } }
    );

    if ( this.ctx.readyState ) this.ctx.parser().invalidateCache();
    this.revId++;

    return super.set( key, value );
  }

  public override get < R extends Ref > ( key: R ) : RegistryDef< R > | undefined {
    return super.get( key ) as RegistryDef< R > | undefined;
  }
}
