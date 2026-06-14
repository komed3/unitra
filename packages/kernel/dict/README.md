# @unitra/dict

Shared enumerations and constants for Unitra.

> **Development Status**  
> Unitra is in an early development stage. Enumerations and identifiers may be extended or adjusted in future releases.

## Installation

```bash
npm install @unitra/dict
```

## Purpose

`@unitra/dict` provides common enumerations and identifiers used across Unitra packages.

Examples include:

* error codes
* language identifiers
* unit systems
* quantity categories

The package contains no runtime services and no physical definitions.

## Exports

Exports through the following entry points:

* `./common` - shared enumerations
* `./quantity` - physical branches
* `./unit` - unit types and status
* `./utils` - utility enumerations

Example:

```ts
import { UnitStatus } from '@unitra/dict/unit';
import { ErrorCode } from '@unitra/dict/utils';
```

## Design Goals

* centralized identifiers
* consistent cross-package contracts
* type-safe shared constants

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
© Copyright 2026 Paul Köhler (komed3). All rights reserved.
