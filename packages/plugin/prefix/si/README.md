# @unitra/plugin-prefix-si

SI prefix definitions for Unitra.

> **Development Status**  
> Unitra is in an early development stage. Definitions and plugin interfaces may change before the first stable release.

## Installation

```bash
npm install @unitra/plugin-prefix-si
```

## Purpose

`@unitra/plugin-prefix-si` provides the official SI prefixes defined by the International System of Units.

This will include: `quetta`, `ronna`, `yotta`, `zetta`, `exa`, `peta`, `tera`, `giga`, `mega`, `kilo`, `hecto`, `deca`, `deci`, `centi`, `milli`, `micro`, `nano`, `pico`, `femto`, `atto`, `zepto`, `yocto`, `ronto`, and `quecto`.

## Exports

### Registry Access

Grant access to all SI prefixes registered in Unitra:

```ts
import prefixes from '@unitra/plugin-prefix-si';
```

### Individual Definitions

Get specific SI prefix definitions directly:

```ts
import kiloDef, { kilo } from '@unitra/plugin-prefix-si/dev/kilo';
```

### Plugin Definition

To load the plugin and register all SI prefixes in Unitra:

```ts
import plugin from '@unitra/plugin-prefix-si/plugin';
```

## Design Goals

* exact SI definitions
* deterministic prefix representation
* plugin-based registration
* strict typing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
