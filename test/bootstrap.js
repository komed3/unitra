import { addPlugins } from '../packages/kernel/core/dist/bootstrap/index.js';
import { unitra } from '../packages/kernel/core/dist/index.js';
import { Logging } from '../packages/kernel/core/dist/utils/logging/index.js';
import { LogLevel } from '../packages/kernel/dict/dist/utils.js';
import siPrefixPlugin from '../packages/plugin/prefix/si/dist/plugin.js';
import baseQuantityPlugin from '../packages/plugin/quantity/base/dist/plugin.js';
import siBaseUnitPlugin from '../packages/plugin/unit/si/base/dist/plugin.js';

Logging.level = LogLevel.DEBUG;

addPlugins(
  siBaseUnitPlugin,
  siPrefixPlugin,
  baseQuantityPlugin
);

const U = unitra();
