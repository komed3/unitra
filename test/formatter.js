import { addPlugins } from '../packages/kernel/core/dist/bootstrap/index.js';
import { unitra } from '../packages/kernel/core/dist/index.js';
import { Lang } from '../packages/kernel/dict/dist/common.js';
import siPrefixPlugin from '../packages/plugin/prefix/si/dist/plugin.js';
import baseQuantityPlugin from '../packages/plugin/quantity/base/dist/plugin.js';
import siBaseUnitPlugin from '../packages/plugin/unit/si/base/dist/plugin.js';

addPlugins(
  siBaseUnitPlugin,
  siPrefixPlugin,
  baseQuantityPlugin
);

const U = unitra();
const f = U.format.bind( U );

const unit = '$1::k:g^1*m^1*u:s^-2';
const value = -325940000;
const state = U.parse( unit ).state;

const test = ( as ) => {
  console.log( as.toUpperCase() + ':' );
  console.log( f( as, state, {}, value ) );
  console.log( f( as, state, { fraction: true, numeric: { sign: 'never', precision: 2 } }, value ) );
  console.log( f( as, state, { numeric: { notation: 'scientific', scientificStyle: 'power' } }, value ) );
  console.log( f( as, state, { fraction: true, numeric: { notation: 'scientific', scientificStyle: 'power' } }, value ) );
  console.log( f( as, state, { lang: Lang.DE, fraction: true, numeric: { notation: 'compact' } }, value ) );
  console.log( f( as, state, { lang: Lang.DE, numeric: { notation: 'scientific', precision: 1 } }, value ) );
};

// PLAIN FORMATTER

test( 'plain' );

// UNICODE FORMATTER

test( 'unicode' );

// LATEX FORMATTER

test( 'latex' );

// TEXT FORMATTER

test( 'text' );
