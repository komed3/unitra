# @unitra/plugin-quantity-base

SI base quantity definitions for Unitra.

> **Development Status**  
> Unitra is in an early development stage. Definitions and plugin interfaces may change before the first stable release.

## Installation

```bash
npm install @unitra/plugin-quantity-base
```

## Purpose

`@unitra/plugin-quantity-base` provides the seven base quantities of the International System of Units.

Included quantities:

* time
* length
* mass
* electric current
* thermodynamic temperature
* amount of substance
* luminous intensity

The package defines quantities only. It does not define units.

## Exports

### Registry Access

Access the registered base quantities in Unitra:

```ts
import quantities from '@unitra/plugin-quantity-base';
```

### Individual Definitions

Get specific base quantity definitions directly:

```ts
import length from '@unitra/plugin-quantity-base/dev/length';
```

### Plugin Definition

To load the plugin and register all base quantities in Unitra:

```ts
import plugin from '@unitra/plugin-quantity-base/plugin';
```

## Design Goals

* explicit quantity modelling
* dimension-based definitions
* strict physical semantics
* plugin-based registration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
