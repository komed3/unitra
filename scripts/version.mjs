#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

class VersionUpdater {
  ROOT = process.cwd();
  BUMPS = [ 'patch', 'minor', 'major' ];

  KEY = {
    CTRL_C: '\u0003', ENTER: '\r', ESC: '\u001b', UP: '\u001b[A', DOWN: '\u001b[B',
    LEFT: '\u001b[D', RIGHT: '\u001b[C', SPACE: ' ', STAR: '*', SEP: '-'
  };

  CTRL = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[90m', green: '\x1b[32m',
    cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m'
  };

  // utils

  isPkgFile = ( dir ) => existsSync( join( dir, 'package.json' ) );
  readPkg = async ( file ) => JSON.parse( await readFile( file, 'utf8' ) );
  out = ( ctrl, out ) => ctrl + out + this.CTRL.reset;
  clear = () => process.stdout.write( '\x1Bc' );

  bump ( v, type ) {
    const [ major, minor, patch ] = v.split( '.' ).map( Number );

    if ( type === 2 || type === 'major' ) return `${ major + 1 }.0.0`;
    if ( type === 1 || type === 'minor' ) return `${ major }.${ minor + 1 }.0`;
    return `${ major }.${ minor }.${ patch + 1 }`;
  }

  replaceVersion ( file, version ) {
    let content = await readFile( file, 'utf8' );

    const matches = [ ...content.matchAll(
      /(?<key>['"]?version['"]?\s*:\s*)(?<quote>['"])(?<version>[^'"]+)(?<end>\k<quote>)/g
    ) ];

    if ( matches.length !== 1 ) throw new Error(
      `Expected exactly one version field in "${ file }" but found ${ matches.length }`
    );

    await writeFile( file, content.replace( matches[ 0 ][ 0 ],
      `${ matches[ 0 ].groups.key }${ matches[ 0 ].groups.quote }` +
      `${ version }${ matches[ 0 ].groups.quote }`
    ) );
  }

  // workspace scan

  async walk ( dir, out = [] ) {
    const entries = await readdir( dir, { withFileTypes: true } );

    if ( this.isPkgFile( dir ) ) {
      try {
        const file = join( dir, 'package.json' );
        const pkg = await this.readPkg( file );

        if ( pkg.name && pkg.version ) out.push( {
          dir, file, name: pkg.name, version: pkg.version, pkg,
          plugin: ( './plugin' in pkg.exports ?? {} ) && join( dir, 'src/plugin.ts' )
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

    console.log( this.out( this.CTRL.yellow + this.CTRL.bold, 'MONOREPO VERSION MANAGER' ) );
    console.log( this.out( this.CTRL.bold, title ) );
    console.log( '' );
    items.forEach( ( it, i ) => console.log( renderer( it, i === cursor ) ) );
    console.log( '' );
    console.log( this.out( this.CTRL.dim, info ) );
  }

  async selector ( { title, items, info, onKey, renderer, result } ) {
    return new Promise( resolve => {
      const render = () => this.renderList( title, items, cursor, info, renderer );
      let cursor = 0;

      const cleanup = this.withRawInput( k => {
        if ( k === this.KEY.CTRL_C || k === this.KEY.ESC ) process.exit( 1 );
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

      renderer: ( item, active ) =>
        `${ active ? '❯' : ' ' } [${ selected.has( item.name ) ? 'x' : ' ' }] ` +
        `${ item.name.padEnd( 40 ) } ` + this.out( this.CTRL.dim, item.version ),

      result: () => [ ...selected ]
    } );
  }

  // step 2 :: bump select

  async selectBumps ( selectedPkgs ) {
    const state = selectedPkgs.map( p => ( { p, i: 0 } ) );

    return this.selector( {
      title: 'Configure Bumps',
      items: state,
      info: '[↑] UP  [↓] DOWN  [←] [→] SELECT BUMP OPTION  [↵] ENTER',

      onKey: ( k, c ) => {
        if ( k === this.KEY.RIGHT ) state[ c ].i = ( state[ c ].i + 1 ) % this.BUMPS.length;
        if ( k === this.KEY.LEFT ) state[ c ].i = ( state[ c ].i + this.BUMPS.length - 1 ) % this.BUMPS.length;
      },

      renderer: ( item, active ) =>
        `${ active ? '❯' : ' ' } ${ item.p.name.padEnd( 40 ) } ` +
        `${ this.out( this.CTRL.cyan, this.BUMPS[ item.i ] ) } ` +
        this.out( this.CTRL.dim, `(${ item.p.version } → ${ this.bump( item.p.version, item.i ) })`
      ),

      result: () => {
        const map = new Map();
        state.forEach( s => map.set( s.p.name, this.BUMPS[ s.i ] ) );
        return map;
      }
    } );
  }

  // step 3 :: release plan

  getReleasePlan ( pkgs, selected, selectedNames, bumpMap ) {
    const changes = new Map();

    for ( const p of selected ) {
      const type = bumpMap.get( p.name );
      changes.set( p.name, { type, from: p.version, to: this.bump( p.version, type ) } );
    }

    const deps = this.findDependents( this.buildGraph( pkgs ), new Set( selectedNames ) );

    for ( const d of deps ) {
      const pkg = pkgs.find( p => p.name === d );
      changes.set( d, { type: 'auto-patch', from: pkg.version, to: this.bump( pkg.version, 'patch' ) } );
    }

    const plan = [ ...changes.entries() ].map( ( [ name, v ] ) => ( { name, ...v } ) );
    return { changes, deps, plan };
  }

  async releasePlan ( plan ) {
    return this.selector( {
      title: 'Release Plan',
      items: plan,
      info: '[ESC] CANCEL  [↵] PROCEED',

      renderer: item =>
        `${ item.name }\n  ${ this.out( this.CTRL.dim, `[${ item.type }]` ) } ` +
        `${ item.from } → ${ this.out( this.CTRL.green, item.to ) }`,

      result: () => true
    } );
  }

  // step 4 :: summary

  async openEditor ( initial = '' ) {
    const file = join( tmpdir(), `release-${ Date.now() }.md` );
    await writeFile( file, initial );

    const editor =
      process.env.GIT_EDITOR || process.env.VISUAL || process.env.EDITOR ||
      ( process.platform === 'win32' ? 'notepad' : 'vi' );

    await new Promise( ( resolve, reject ) => {
      const child = spawn( editor, [ file ], { stdio: 'inherit' } );
      child.on( 'error', reject );

      child.on( 'exit', code => {
        if ( code === 0 ) resolve();
        else reject( new Error( `Editor exited with code ${ code }` ) );
      } );
    } );

    const content = await readFile( file, 'utf8' );
    return content.trim();
  }

  // step 5 :: update versions

  async updateVersions ( pkgs, plan ) {
    const changes = new Map( plan.map( p => [ p.name, p.to ] ) );
    const updated = [];

    for ( const pkg of pkgs ) {
      const version = changes.get( pkg.name );
      if ( ! version ) continue;

      this.replaceVersion( pkg.file, version );
      updated.push( { name: pkg.name, from: pkg.version, to: version } );
      if ( pkg.plugin ) this.replaceVersion( pkg.plugin, version );
    }

    return updated;
  }

  // step 6 :: write changelog

  async writeChangelog ( plan, summary ) {
    const file = join( this.ROOT, 'CHANGELOG.md' );
    const old = existsSync( file ) ? await readFile( file, 'utf8' ) : '# Changelog\n\n';
    const date = new Date().toISOString().slice( 0, 10 );
    const packages = plan.map( p => `- ${ p.name } (${ p.from } → ${ p.to })` ).join( '\n' );

    const entry = [
      `## ${ date }`, '', '### Summary', '', summary.trim() || 'No summary',
      '', '### Packages', '', packages, '', '---', ''
    ].join( '\n' );

    await writeFile( file, old + entry );
  }

  // step 7 :: log result

  logResult ( updated ) {
    this.clear();

    console.log( this.out( this.CTRL.yellow + this.CTRL.bold, 'MONOREPO VERSION MANAGER' ) );
    console.log( this.out( this.CTRL.bold, 'Updated Packages' ) );
    console.log( '' );

    for ( const item of updated ) console.log(
      `  ${ item.name.padEnd( 40 ) } ${ item.from } → ` + this.out( this.CTRL.green, item.to )
    );

    console.log( '' );
    console.log( this.out( this.CTRL.green, '✓ Ready to release' ) );
    console.log( '' );
  }

  // main

  async run () {
    const pkgs = ( await this.walk( this.ROOT ) ).sort( ( a, b ) => a.name.localeCompare( b.name ) );
    if ( ! pkgs.length ) throw new Error( 'No packages found' );

    const selectedNames = await this.selectPackages( pkgs );
    const selected = pkgs.filter( p => selectedNames.includes( p.name ) );
    const bumpMap = await this.selectBumps( selected );

    const { plan } = this.getReleasePlan( pkgs, selected, selectedNames, bumpMap );
    if ( ! await this.releasePlan( plan ) ) return;

    const summary = await this.openEditor();
    const updated = await this.updateVersions( pkgs, plan );
    await this.writeChangelog( plan, summary );
    this.logResult( updated );
  }
}

// run the script

new VersionUpdater().run().catch( e => {
  console.error( e.stack || e );
  process.exit( 1 );
} );
