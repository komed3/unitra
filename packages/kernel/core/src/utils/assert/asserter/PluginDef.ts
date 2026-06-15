import type { PluginDefinition } from '@unitra/types/core/plugin';
import { Semver } from '../../Semver';
import { UnitraError } from '../../error';

export class AssertPluginDef {
  public static is ( value: unknown ) : value is PluginDefinition {
    return typeof value === 'object' && value !== null &&
      'id' in value && typeof value.id === 'string' &&
      'version' in value && typeof Semver.isSemver( value.version ) &&
      'meta' in value && typeof value.meta === 'object' && value.meta !== null &&
      'name' in value.meta && typeof value.meta.name === 'string';
  }

  public static assert ( value: unknown ) : asserts value is PluginDefinition {
    if ( ! this.is( value ) ) throw UnitraError.from(
      new TypeError( `expected a valid plugin definition` ),
      { context: { value } }
    );
  }
}
