# @unitra/types

Shared TypeScript type definitions for Unitra.

> **Development Status**  
> Unitra is in an early development stage. Type definitions may change as APIs evolve.

## Installation

```bash
npm install @unitra/types
```

## Purpose

`@unitra/types` contains the shared TypeScript declarations used throughout the Unitra ecosystem.

The package contains type definitions only and does not provide runtime functionality.

Typical contents include:

* registry types
* parser types
* formatter types
* plugin contracts
* service contracts
* quantity, unit and prefix definitions
* internal data structures

## Exports

The package has the following exports:

* `./common` - common types used across multiple packages
* `./dim` - dimension-related types
* `./node` - internal references to AST nodes
* `./core/*` - core types related to parsing, formatting, and registry
* `./def/*` - definitions for quantities, units, prefixes, and plugins
* `./utils/*` - utility types for internal use

## Usage

```ts
import type { UnitDef } from '@unitra/types/def/unit';
import type { ParserResult } from '@unitra/types/core/parser';
```

## Design Goals

* strict compile-time validation
* reusable contracts across packages
* stable foundation for plugin development
* zero runtime footprint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
