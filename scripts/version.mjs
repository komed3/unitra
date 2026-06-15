#!/usr/bin/env node

const ROOT = process.cwd();
const BUMPS = [ 'major', 'minor', 'patch' ];

const CONSOLE = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[90m', green: '\x1b[32m',
  cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m'
};
