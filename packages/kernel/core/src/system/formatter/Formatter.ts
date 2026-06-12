import type { IFormatter } from '@unitra/types/core/formatter';
import type { RefOf, RegistryDef, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { getTypedRegistry } from '../registry';

export abstract class Formatter implements IFormatter {
  constructor ( protected readonly ctx: UnitraContext ) {}

  protected get < K extends RegistryKey > ( key: K, ref: RefOf< K > ) : RegistryDef< RefOf< K > > | undefined {
    return getTypedRegistry( this.ctx, key ).get( ref );
  }
}
