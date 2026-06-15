import type { PluginDefinition } from '@unitra/types/core/plugin';
import type { SemverVersion } from '@unitra/types/utils/semver';
import { Semver } from '../Semver';

export const isPluginDef = ( value: unknown ) : value is PluginDefinition => {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' &&
    'version' in value && typeof value.version === 'string' && !! Semver.parse( value.version as SemverVersion ) &&
    'meta' in value && typeof value.meta === 'object' && value.meta !== null && 'name' in value.meta &&
    typeof value.meta.name === 'string';
};
