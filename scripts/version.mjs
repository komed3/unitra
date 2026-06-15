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

  async walk ( dir, out = [] ) {
    const entries = await readdir( dir, { withFileTypes: true } );
  
    if ( isPkgFile( dir ) ) {
      try {
        const file = join( dir, 'package.json' );
        const pkg = await readPkg( file );
  
        if ( pkg.name && pkg.version ) out.push( {
          dir, file, name: pkg.name, version: pkg.version, pkg
        } );
      } catch {}
    }
  
    for ( const e of entries ) {
      if ( ! e.isDirectory() ) continue;
      if ( e.name === 'node_modules' || e.name === '.git' || e.name.startsWith( '.' ) ) continue;
  
      await walk( path.join( dir, e.name ), out );
    }
  
    return out;
  }
}
