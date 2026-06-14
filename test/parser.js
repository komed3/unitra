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
const s = U.serialize.bind( U );
const p = U.parse.bind( U );

const test = ( input ) => console.log( s( p( input ).state ) );

// BASIC TESTS

test( '(m/s)^-2' );
test( '((m/s)^2)^3' );
test( '(((m)))' );
test( '50*(m/s)^2' );
test( '(m/s^-2)^-3' );
test( '(((kilo-meter^3*(s*s/m))/daK^-2*candela)*50)' );
test( '((s*kg)/(m^2)*cd^-1)*20s' );
test( '(((m^2)^3/s^-4)^2)^-1' );

// SPECIAL FORMATS

test( { nodes: [ { type: 'unit', unit: 'cd', exp: 1 } ] } );
test( '$1::k:m^1*s^-1' );

// ROUND-TRIP

const input = '$1::#20^1*k:g^1*m^1*s^-2';
console.log( s( p( s( p( s( p( input ).state ) ).state ) ).state ) === input );

// TEST COMMUTATIVITY

const a = p( input ).state;
const b = p( s( a ) ).state;
console.log( s( a ) === s( b ) );
