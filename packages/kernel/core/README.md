# @unitra/core

Core infrastructure for Unitra.

> **Development Status**  
> Unitra is in an early development stage. APIs, package structure and internal contracts may change without notice until a stable release series is established.

## Installation

```bash
npm install @unitra/core
```

## Purpose

`@unitra/core` provides the central runtime infrastructure of Unitra.

It contains:

* bootstrap and context creation
* plugin loading
* service container
* contribution registries (units, quantities, ...)
* parser infrastructure
* formatter infrastructure
* quantity, unit and prefix resolution
* main user API entry point
* utilities

The package itself does not define physical quantities, units or prefixes. These are provided by separate plugin packages.

## Exports

By the core package, following exports are declared:

* `.` - the main entry point of the package, re-exporting all public APIs
* `./bootstrap` - APIs related to bootstrapping and context creation
* `./utils/*` - utility functions and types

Example:

```ts
import { unitra } from '@unitra/core';
import { addPlugins, resolvePlugins } from '@unitra/core/bootstrap';
import { UnitraError } from '@unitra/core/utils/error';
```

## Usage

Manual registration of Unitra plugins:

```ts
import { addPlugins } from '@unitra/core/bootstrap';
import siPrefixPlugin from '@unitra/plugin-prefix-si/plugin';
import siBaseQuantityPlugin from '@unitra/plugin-quantity-base/plugin';
import siBaseUnitPlugin from '@unitra/plugin-unit-si-base/plugin';

addPlugins(
  siPrefixPlugin,
  siBaseQuantityPlugin,
  siBaseUnitPlugin
);
```

Instantiate main Unitra API:

```ts
import { unitra } from '@unitra/core';
const U = unitra();
```

## Design Goals

* modular architecture
* strict typing
* plugin-based extensibility
* precise representation of physical quantities and units
* deterministic unit definitions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
