#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

class VersionUpdater {
  ROOT = process.cwd();
  BUMPS = [ 'patch', 'minor', 'major' ];

  KEY = {
    CTRL_C: '\u0003', ENTER: '\r', UP: '\u001b[A', DOWN: '\u001b[B', LEFT: '\u001b[D',
    RIGHT: '\u001b[C', SPACE: ' ', STAR: '*', SEP: '-'
  };

  CTRL = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[90m', green: '\x1b[32m',
    cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m'
  };

  // utils

  isPkgFile = ( dir ) => existsSync( join( dir, 'package.json' ) );
  readPkg = async ( file ) => JSON.parse( await readFile( file, 'utf8' ) );
  clr = ( ctrl, out ) => ctrl + out + this.CTRL.reset;
  clear = () => process.stdout.write( '\x1Bc' );

  bump ( v, type ) {
    const [ major, minor, patch ] = v.split( '.' ).map( Number );

    if ( type === 2 || type === 'major' ) return `${ major + 1 }.0.0`;
    if ( type === 1 || type === 'minor' ) return `${ major }.${ minor + 1 }.0`;
    return `${ major }.${ minor }.${ patch + 1 }`;
  }

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

  withRawInput ( handler ) {
    process.stdin.setRawMode( true );
    process.stdin.resume();
    process.stdin.setEncoding( 'utf8' );
    process.stdin.on( 'data', handler );

    return () => {
      process.stdin.off( 'data', handler );
      try { process.stdin.setRawMode( false ) } catch {}
      process.stdin.pause();
    };
  }

  // selector engine

  renderList ( title, items, cursor, info, renderer ) {
    this.clear();

    console.log( this.clr( this.CTRL.yellow + this.CTRL.bold, 'UNITRA VERSION MANAGER' ) );
    console.log( this.clr( this.CTRL.bold, title ) );
    console.log( '' );
    items.forEach( ( it, i ) => console.log( renderer( it, i === cursor ) ) );
    console.log( '' );
    console.log( this.clr( this.CTRL.dim, info ) );
  }

  async selector ( { title, items, info, onKey, renderer, result } ) {
    return new Promise( resolve => {
      const render = () => this.renderList( title, items, cursor, info, renderer );
      let cursor = 0;

      const cleanup = this.withRawInput( k => {
        if ( k === this.KEY.CTRL_C ) process.exit( 1 );
        if ( k === this.KEY.UP ) cursor = Math.max( 0, cursor - 1 );
        if ( k === this.KEY.DOWN ) cursor = Math.min( items.length - 1, cursor + 1 );

        if ( k === this.KEY.ENTER ) {
          cleanup();
          resolve( result() );

          return;
        }

        onKey?.( k, cursor );
        render();
      } );

      render();
    } );
  }

  // step 1 :: pkg select

  async selectPackages ( pkgs ) {
    const selected = new Set();

    return this.selector( {
      title: 'Select Packages',
      items: pkgs,
      info: '[↑] UP  [↓] DOWN  [␣] TOGGLE  [*] ALL  [-] NONE  [↵] ENTER',

      onKey: ( k, cursor ) => {
        if ( k === this.KEY.SPACE ) {
          const name = pkgs[ cursor ].name;
          selected.has( name ) ? selected.delete( name ) : selected.add( name );
        }

        if ( k === this.KEY.STAR ) pkgs.forEach( p => selected.add( p.name ) );
        if ( k === this.KEY.SEP ) selected.clear();
      },

      renderer: ( p, active ) =>
        `${ active ? '❯' : ' ' } [${ selected.has( p.name ) ? 'x' : ' ' }] ` +
        `${ p.name.padEnd( 40 ) } ` + this.clr( this.CTRL.dim, p.version ),

      result: () => [ ...selected ]
    } );
  }

  // step 2 :: bump select

  async selectBumps( selectedPkgs ) {
    const state = selectedPkgs.map( p => ( { p, i: 0 } ) );

    return this.selector( {
      title: 'Configure Bumps',
      items: state,
      info: '[↑] UP  [↓] DOWN  [←] [→] SELECT BUMP OPTION  [↵] ENTER',

      onKey: ( k, c ) => {
        if ( k === this.KEY.RIGHT ) state[ c ].i = ( state[ c ].i + 1 ) % this.BUMPS.length;
        if ( k === this.KEY.LEFT ) state[ c ].i = ( state[ c ].i + this.BUMPS.length - 1 ) % this.BUMPS.length;
      },

      renderer: ( s, active ) =>
        `${ active ? '❯' : ' ' } ${ s.p.name.padEnd( 40 ) } ` +
        `${ this.clr( this.CTRL.cyan, this.BUMPS[ s.i ] ) } ` +
        this.clr( this.CTRL.dim, `(${ s.p.version } → ${ this.bump( s.p.version, s.i ) })`
      ),

      result: () => {
        const map = new Map();
        state.forEach( s => map.set( s.p.name, this.BUMPS[ s.i ] ) );
        return map;
      }
    } );
  }

  // main

  async run () {
    const pkgs = ( await this.walk( this.ROOT ) ).sort( ( a, b ) => a.name.localeCompare( b.name ) );
    if ( ! pkgs.length ) throw new Error( 'No packages found' );

    const selectedNames = await this.selectPackages( pkgs );
    const selected = pkgs.filter( p => selectedNames.includes( p.name ) );
    const bumpMap = await this.selectBumps( selected );
  }
}

// run the script

new VersionUpdater().run().catch( e => {
  console.error( e.stack || e );
  process.exit( 1 );
} );
