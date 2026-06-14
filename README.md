# Unitra

Modular TypeScript ecosystem focused on physical units, dimensions, constants and scientific computation.

> **Development Status**
>
> Unitra is currently in an early development stage.
>
> APIs, package structure and internal contracts may change without notice until a stable release series is established.
>
> The current release should be considered experimental.

## Goals

Unitra is designed around a few core principles:

* modular architecture
* plugin-based extensibility
* strict typing
* deterministic definitions
* separation of quantities, units and prefixes
* explicit physical modelling

The framework aims to provide a precise representation of physical measurement systems while remaining extensible for custom domains and non-SI systems.

## Installation

Install the core package and the desired plugins:

```bash
npm install \
  @unitra/core \
  @unitra/plugin-prefix-si \
  @unitra/plugin-quantity-base \
  @unitra/plugin-unit-si-base
```

## Register Plugins

Plugins must currently be registered manually.

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

Automatic plugin loading and manifest support are planned for a future release.

## Create a Unitra Instance

The returned instance provides access to registries, parsers, formatters, factories and other services.

```ts
import { unitra } from '@unitra/core';
const U = unitra();
```

## API

### Parse Units

The parser returns a structured representation of the input expression.

```ts
const result = U.parse( 'km/s' );
```

### Format Units

Different formatter implementations provide different output formats.

```ts
const formatted = U.format( 'latex', result.state );
```

Formatter:

* `unicode` - Unicode text
* `latex` - LaTeX code
* `text` - accessibility-oriented output
* `plain` - plain text

### Serialize Units

Serialization produces a deterministic string representation of a unit structure.

```ts
const serialized = U.serialize( result.state );
```

### Access Registries

Registries contain the definitions registered by loaded plugins.

```ts
const prefixes = U.registry( 'prefix' );
const quantities = U.registry( 'quantity' );
const units = U.registry( 'unit' );
const constants = U.registry( 'contant' );
```

### Resolution Services

Access to methods for resolving references and definitions of units, prefixes, etc.

```ts
const resolve = U.resolve();
```

### Assertion Services

Assertion services provide validation helpers for all references and definitions.

```ts
const assert = U.assert();
```

### Unit Factory

Factories can be used to construct and manipulate unit structures programmatically.

Each step will produce a new immutable unit structure.

```ts
const velocity = U.unit().mul( 'm', { prefix: 'k' } ).div( 's' );
```

## Physical Model

Unitra distinguishes between several independent concepts:

### Quantities

Physical concepts such as:

* length
* mass
* time
* temperature

Quantities are associated with dimension vectors.

### Units

Measurement units assigned to quantities.

Examples:

* meter
* gram
* second
* kelvin

### Prefixes

Scaling factors applied to units.

Examples:

* kilo
* mega
* micro
* nano

This separation allows quantities, units and prefixes to be defined, validated and extended independently.

## Available Packages

### Core Packages

| Package         | Description                           |
| --------------- | ------------------------------------- |
| `@unitra/core`  | Runtime infrastructure and public API |
| `@unitra/types` | Shared TypeScript definitions         |
| `@unitra/dict`  | Enumerations and shared constants     |
| `@unitra/dim`   | Dimension vector definitions          |

### Official Plugins

| Package                        | Description              |
| ------------------------------ | ------------------------ |
| `@unitra/plugin-prefix-si`     | SI prefix definitions    |
| `@unitra/plugin-quantity-base` | Seven SI base quantities |
| `@unitra/plugin-unit-si-base`  | Seven SI base units      |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
