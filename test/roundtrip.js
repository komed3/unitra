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

// BUILD + SERIALIZE

const unit = U.unit().mul( 'g', { prefix: 'k' } ).mul( 'm' ).div( 's', { exp: 2, prefix: 'u' } );
const serialized = unit.serialize();
console.log( '>> STEP 1 [BUILD + SERIALIZE] ::', serialized );

// FORMAT

const format = U.format( 'text', unit.toObj() );
console.log( '>> STEP 2 [FORMAT OUTPUT] ::', format );

// PARSE

const parsed = U.parse( format ).state;
console.log( '>> STEP 3 [PARSE FORMATTED TEXT] ::', JSON.stringify( parsed ) );

// SERIALIZE AGAIN

const test = U.serialize( parsed );
console.log( '>> STEP 4 [TEST RESULT] ::', test, serialized === test );
