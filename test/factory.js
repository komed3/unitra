import { addPlugins } from '../packages/kernel/core/dist/bootstrap/index.js';
import { unitra } from '../packages/kernel/core/dist/index.js';
import siPrefixPlugin from '../packages/plugin/prefix/si/dist/plugin.js';
import baseQuantityPlugin from '../packages/plugin/quantity/base/dist/plugin.js';
import siBaseUnitPlugin from '../packages/plugin/unit/si/base/dist/plugin.js';

addPlugins(
  siBaseUnitPlugin,
  siPrefixPlugin,
  baseQuantityPlugin
);

const U = unitra();

// FACTORY

const newton = U.unit().mul( 'g', { prefix: 'k' } ).mul( 'm' ).div( 's' );
console.log( newton.toJSON() );

// DIFFERENT STATES

const nm1 = newton.mul( 'm' );
const nm2 = newton.mul( 'm' );
console.log( nm1 !== nm2 );

// SERIALIZE

console.log( newton.serialize() );
console.log( U.serialize( nm1.toObj() ) );
