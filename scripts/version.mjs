#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

class VersionUpdater {
  ROOT = process.cwd();
  BUMPS = [ 'patch', 'minor', 'major' ];

  INFO = {
    list: '[↑] UP  [↓] DOWN  [␣] TOGGLE  [*] ALL  [-] NONE  [↵] ENTER',
    bump: '[←] [→] SELECT BUMP OPTION  [↵] ENTER'
  };

  CONSOLE = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[90m', green: '\x1b[32m',
    cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m'
  };

  // utils

  clr = ( ctrl, out ) => ctrl + out + this.CONSOLE.reset;
  clear = () => process.stdout.write( '\x1Bc' );

  bump ( v, type ) {
    const [ major, minor, patch ] = v.split( '.' ).map( Number );

    if ( type === 'major' ) return `${ major + 1 }.0.0`;
    if ( type === 'minor' ) return `${ major }.${ minor + 1 }.0`;
    return `${ major }.${ minor }.${ patch + 1 }`;
  }

  isPkgFile = ( dir ) => existsSync( join( dir, 'package.json' ) );
  readPkg = async ( file ) => JSON.parse( await readFile( file, 'utf8' ) );

  // workspace scan

  async walk ( dir, out = [] ) {
    const entries = await readdir( dir, { withFileTypes: true } );

    if ( this.isPkgFile( dir ) ) {
      try {
        const file = join( dir, 'package.json' );
        const pkg = await this.readPkg( file );

        if ( pkg.name && pkg.version ) out.push( {
          dir, file, name: pkg.name, version: pkg.version, pkg
        } );
      } catch {}
    }

    for ( const e of entries ) {
      if ( ! e.isDirectory() || e.name === 'node_modules' || e.name.startsWith( '.' ) ) continue;
      await this.walk( join( dir, e.name ), out );
    }

    return out;
  }

  // dependency graph

  buildGraph ( pkgs ) {
    const g = new Map();

    for ( const p of pkgs ) {
      const deps = new Set();

      for ( const f of [ 'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies' ] )
        Object.keys( p.pkg[ f ] ?? {} ).forEach( d => deps.add( d ) );

      g.set( p.name, deps );
    }

    return g;
  }

  findDependents ( g, roots ) {
    const affected = new Set();
    const queue = [ ...roots ];

    while ( queue.length ) {
      const cur = queue.shift();

      for ( const [ name, deps ] of g ) {
        if ( ! deps.has( cur ) ) continue;
        if ( roots.has( name ) || affected.has( name ) ) continue;

        affected.add( name );
        queue.push( name );
      }
    }

    return affected;
  }

  // terminal raw input

  raw ( onKey ) {
    process.stdin.setRawMode( true );
    process.stdin.resume();
    process.stdin.setEncoding( 'utf8' );
    process.stdin.on( 'data', onKey );
  }

  unraw () {
    try { process.stdin.setRawMode( false ) } catch {}
    process.stdin.removeAllListeners( 'data' );
  }

  // selector engine

  renderList ( title, items, cursor, info, renderer ) {
    this.clear();

    console.log( this.clr( this.CONSOLE.bold, title ) );
    console.log( '' );
    items.forEach( ( it, i ) => console.log( renderer( it, i === cursor ) ) );
    console.log( '' );
    console.log( this.clr( this.CONSOLE.dim, info ) );
  }

  // step 1 :: pkg select

  async selectPackages ( pkgs ) {
    const selected = new Set();
    const renderList = ( r ) => this.renderList( 'Select Packages', pkgs, cursor, this.INFO.list, r );
    let cursor = 0;

    return new Promise( resolve => {
      this.raw( k => {
        if ( k === '\u0003' ) process.exit( 1 );
        if ( k === '\u001b[A' ) cursor = Math.max( 0, cursor - 1 );
        if ( k === '\u001b[B' ) cursor = Math.min( pkgs.length - 1, cursor + 1 );

        if ( k === ' ' ) {
          const name = pkgs[ cursor ].name;
          selected.has( name ) ? selected.delete( name ) : selected.add( name );
        }

        if ( k === '*' ) pkgs.forEach( p => selected.add( p.name ) );
        if ( k === '-' ) selected.clear();

        if ( k === '\r' ) {
          this.unraw();
          resolve( [ ...selected ] );

          return;
        }

        renderList( ( p, active ) =>
          `${ active ? '❯' : ' ' } [${ selected.has( p.name ) ? 'x' : ' ' }] ` +
          `${ p.name.padEnd( 40 ) } ${ this.clr( this.CONSOLE.dim, p.version ) }`
        );
      } );

      renderList( ( p, active ) =>
        `${ active ? '❯' : ' ' } [ ] ${ p.name.padEnd( 40 ) } ` +
        `${ this.clr( this.CONSOLE.dim, p.version ) }`
      );
    } );
  }

  // main

  async run () {
    const pkgs = ( await this.walk( this.ROOT ) ).sort( ( a, b ) => a.name.localeCompare( b.name ) );
    if ( ! pkgs.length ) throw new Error( 'No packages found' );

    const selectedNames = await this.selectPackages( pkgs );
    const selected = pkgs.filter( p => selectedNames.includes( p.name ) );
  }
}

// run the script

new VersionUpdater().run().catch( e => {
  try { process.stdin.setRawMode( false ) } catch {}
  process.stdin.removeAllListeners( 'data' );

  console.error( e.stack || e );
  process.exit( 1 );
} );
