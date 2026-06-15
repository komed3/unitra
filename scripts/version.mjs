#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

class VersionUpdater {
  ROOT = process.cwd();
  BUMPS = [ 'major', 'minor', 'patch' ];

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
      await walk( join( dir, e.name ), out );
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

  renderList ( title, items, cursor, renderer, info ) {
    this.clear();

    console.log( this.clr( this.CONSOLE.bold, title ) );
    console.log( '' );
    items.forEach( ( it, i ) => console.log( renderer( it, i === cursor ) ) );
    console.log( '' );
    console.log( this.clr( this.CONSOLE.dim, info ) );
  }

  // main

  run () {}
}

// run the script

new VersionUpdater().run().catch( e => {
  try { process.stdin.setRawMode( false ) } catch {}
  process.stdin.removeAllListeners( 'data' );

  console.error( e.stack || e );
  process.exit( 1 );
} );
