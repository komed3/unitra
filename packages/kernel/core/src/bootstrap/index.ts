import type { PluginDefinition } from '@unitra/types/core/plugin';
import type { SemverVersion } from '@unitra/types/utils/semver';
import { Init } from './Init';
import { PluginLoader } from './PluginLoader';
import { PluginRegistry } from './PluginRegistry';
import { PluginResolver } from './PluginResolver';

export { Init, PluginLoader, PluginRegistry, PluginResolver };

export const addPlugins = ( ...plugins: PluginDefinition[] ) => PluginRegistry.add( ...plugins );
export const addPlugin = ( plugin: PluginDefinition ) => PluginRegistry.add( plugin );
export const removePlugin = ( id: string, version?: SemverVersion ) => PluginRegistry.remove( id, version );
export const hasPlugin = ( id: string, version?: SemverVersion ) => PluginRegistry.has( id, version );
export const listPlugins = () => PluginRegistry.list();

export const resolvePlugins = () => PluginResolver.resolve();
