import { PrefixRegistry } from '@unitra/types/registry';

import _deca, { deca } from './def/pos/deca';
import _exa, { exa } from './def/pos/exa';
import _giga, { giga } from './def/pos/giga';
import _hecto, { hecto } from './def/pos/hecto';
import _kilo, { kilo } from './def/pos/kilo';
import _mega, { mega } from './def/pos/mega';
import _peta, { peta } from './def/pos/peta';
import _quetta, { quetta } from './def/pos/quetta';
import _ronna, { ronna } from './def/pos/ronna';
import _tera, { tera } from './def/pos/tera';
import _yotta, { yotta } from './def/pos/yotta';
import _zetta, { zetta } from './def/pos/zetta';

import _atto, { atto } from './def/neg/atto';
import _centi, { centi } from './def/neg/centi';
import _deci, { deci } from './def/neg/deci';
import _femto, { femto } from './def/neg/femto';
import _micro, { micro } from './def/neg/micro';
import _milli, { milli } from './def/neg/milli';
import _nano, { nano } from './def/neg/nano';
import _pico, { pico } from './def/neg/pico';
import _quecto, { quecto } from './def/neg/quecto';
import _ronto, { ronto } from './def/neg/ronto';
import _yocto, { yocto } from './def/neg/yocto';
import _zepto, { zepto } from './def/neg/zepto';

export default ( {
  [ quetta ]: _quetta,  [ ronna ]: _ronna,  [ yotta ]: _yotta,
  [ zetta ]: _zetta,    [ exa ]: _exa,      [ peta ]: _peta,
  [ tera ]: _tera,      [ giga ]: _giga,    [ mega ]: _mega,
  [ kilo ]: _kilo,      [ hecto ]: _hecto,  [ deca ]: _deca,
  [ deci ]: _deci,      [ centi ]: _centi,  [ milli ]: _milli,
  [ micro ]: _micro,    [ nano ]: _nano,    [ pico ]: _pico,
  [ femto ]: _femto,    [ atto ]: _atto,    [ zepto ]: _zepto,
  [ yocto ]: _yocto,    [ ronto ]: _ronto,  [ quecto ]: _quecto
} ) as const satisfies PrefixRegistry;
