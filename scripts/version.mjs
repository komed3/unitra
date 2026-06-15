#!/usr/bin/env node

const ROOT = process.cwd();
const BUMPS = [ 'major', 'minor', 'patch' ];

const CONSOLE = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[90m', green: '\x1b[32m',
  cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m'
};

class VersionUpdater {
  #clr ( ctrl, out ) {
    return ctrl + out + CONSOLE.reset;
  }

  #clear () {
    process.stdout.write( '\x1Bc' );
  }

  #bump ( v, type ) {
    const [ M, m, p ] = v.split( '.' ).map( Number );

    if ( type === 'major' ) return `${ M + 1 }.0.0`;
    if ( type === 'minor' ) return `${ M }.${ m + 1 }.0`;
    return `${ M }.${ m }.${ p + 1 }`;
  }
}
