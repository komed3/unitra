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

// STRUCTURAL EQUALITY

const a = p( input ).state;
const b = p( s( a ) ).state;
console.log( s( a ) === s( b ) );

// COMPLEX TESTS

test( '( 25 kilo meter / ( s * microsecond ) ) * K^2' );
test( '((s*kg)/(m^2)*cd^-1)*20s' );
test( '(((kilo-meter^3*(s*s/m))/daK^-2*candela)*50)' );
test( '50*A^2/A^-2' );
test( '45 milligram per kilo moles' );
test( '((25 kilo meter per micro-second)^2 / (3.14e-4 * daK^-2)) * 50' );
test( 'kg·m²/ms²' );
test( 'mm / m m' );
test( '-.5e-3 kg·m²/(micro-second)^⁻²' );
test( '6.1e5 kilo gram meter per second squared' );

// FINAL BOSS

test( `(
  (
    125 milli gram
    * (kilo meter / micro-second)^2
    * (daK^-2 / nano mole)
  )
  /
  (
    (3.14159e-6 * mm^3)
    * ((mega mole / milli-second) / (kilo meter^2))
  )
)
*
(
  (
    (micro-second * milli-second)
    /
    (nano-second^2)
  )
  *
  (
    (gram / milli gram)
    * (kilo mole / micro-mole)
  )
)` );
