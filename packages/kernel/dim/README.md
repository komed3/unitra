# @unitra/dim

Dimension vector definitions for Unitra.

> **Development Status**  
> Unitra is in an early development stage. Additional dimensions and helper utilities may be added in future releases.

## Installation

```bash
npm install @unitra/dim
```

## Purpose

`@unitra/dim` contains predefined dimension vectors used to describe physical quantities.

Dimensions are represented as immutable vectors.

Example:

```ts
export const LengthDim = [ 0, 1, 0, 0, 0, 0, 0 ] as const;
export const PressureDim = [ -2, -1, 1, 0, 0, 0, 0 ] as const;
export const ScalarDim = [ 0, 0, 0, 0, 0, 0, 0 ] as const;
```

The package contains no units, prefixes or conversion logic.

## Exports

The package exports its vectors from three entry points:

* `./base` - SI base vectors like length, mass, time
* `./derived` - derived vectors like pressure, energy
* `./scalar` - dimensionless vectors

Example:

```ts
import { LengthDim } from '@unitra/dim/base';
```

## Design Goals

* explicit dimensional modelling
* deterministic dimension definitions
* reusable physical foundations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
