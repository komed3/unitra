# @unitra/plugin-unit-si-base

SI base unit definitions for Unitra.

> **Development Status**  
> Unitra is in an early development stage. Definitions and plugin interfaces may change before the first stable release.

## Installation

```bash
npm install @unitra/plugin-unit-si-base
```

## Dependencies

This plugin will need the following Unitra packages to work:

```bash
npm install @unitra/plugin-quantity-base
```

## Purpose

`@unitra/plugin-unit-si-base` provides the seven SI base units.

Included units:

* meter (`m`)
* gram (`g`)
* second (`s`)
* ampere (`A`)
* kelvin (`K`)
* mole (`mol`)
* candela (`cd`)

The package depends on the corresponding quantity definitions provided by `@unitra/plugin-quantity-base`.

Unlike the SI standard, the base unit for mass is defined as gram (`g`) instead of kilogram (`kg`) to maintain internal consistency. The kilogram is defined as gram with the prefix kilo (`k`) applied, ensuring that all units are defined without prefixes. This design choice allows for a more straightforward and consistent unit structure within the Unitra system.

## Exports

### Registry Access

Have access to the plugin's unit registry:

```ts
import units from '@unitra/plugin-unit-si-base';
```

### Individual Definitions

Get individual unit definitions directly:

```ts
import meterDef, { meter } from '@unitra/plugin-unit-si-base/dev/meter';
```

### Plugin Definition

Load the plugin to register all units:

```ts
import { addPlugin } from '@unitra/core/bootstrap';
import siBaseUnitPlugin from '@unitra/plugin-unit-si-base/plugin';

addPlugin( siBaseUnitPlugin );
```

## Design Goals

* exact SI unit definitions
* deterministic unit structures
* strict quantity-to-unit relationships
* plugin-based registration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
