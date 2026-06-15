#!/usr/bin/env node

class VersionUpdater {
  #ROOT = process.cwd();
  #BUMPS = [ 'major', 'minor', 'patch' ];

  #CONSOLE = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[90m', green: '\x1b[32m',
    cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m'
  };

  #clr = ( ctrl, out ) => ctrl + out + this.#CONSOLE.reset;
  #clear = () => process.stdout.write( '\x1Bc' );

  #bump ( v, type ) {
    const [ major, minor, patch ] = v.split( '.' ).map( Number );

    if ( type === 'major' ) return `${ major + 1 }.0.0`;
    if ( type === 'minor' ) return `${ major }.${ minor + 1 }.0`;
    return `${ major }.${ minor }.${ patch + 1 }`;
  }
}
