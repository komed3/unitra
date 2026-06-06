import { PrefixMap } from '@unitra/types/def/prefix';

import decaDef, { deca } from './def/pos/deca';
import exaDef, { exa } from './def/pos/exa';
import gigaDef, { giga } from './def/pos/giga';
import hectoDef, { hecto } from './def/pos/hecto';
import kiloDef, { kilo } from './def/pos/kilo';
import megaDef, { mega } from './def/pos/mega';
import petaDef, { peta } from './def/pos/peta';
import quettaDef, { quetta } from './def/pos/quetta';
import ronnaDef, { ronna } from './def/pos/ronna';
import teraDef, { tera } from './def/pos/tera';
import yottaDef, { yotta } from './def/pos/yotta';
import zettaDef, { zetta } from './def/pos/zetta';

import attoDef, { atto } from './def/neg/atto';
import centiDef, { centi } from './def/neg/centi';
import deciDef, { deci } from './def/neg/deci';
import femtoDef, { femto } from './def/neg/femto';
import microDef, { micro } from './def/neg/micro';
import milliDef, { milli } from './def/neg/milli';
import nanoDef, { nano } from './def/neg/nano';
import picoDef, { pico } from './def/neg/pico';
import quectoDef, { quecto } from './def/neg/quecto';
import rontoDef, { ronto } from './def/neg/ronto';
import yoctoDef, { yocto } from './def/neg/yocto';
import zeptoDef, { zepto } from './def/neg/zepto';

export default ( {
  [ quetta ]: quettaDef,
  [ ronna ]: ronnaDef,
  [ yotta ]: yottaDef,
  [ zetta ]: zettaDef,
  [ exa ]: exaDef,
  [ peta ]: petaDef,
  [ tera ]: teraDef,
  [ giga ]: gigaDef,
  [ mega ]: megaDef,
  [ kilo ]: kiloDef,
  [ hecto ]: hectoDef,
  [ deca ]: decaDef,

  [ deci ]: deciDef,
  [ centi ]: centiDef,
  [ milli ]: milliDef,
  [ micro ]: microDef,
  [ nano ]: nanoDef,
  [ pico ]: picoDef,
  [ femto ]: femtoDef,
  [ atto ]: attoDef,
  [ zepto ]: zeptoDef,
  [ yocto ]: yoctoDef,
  [ ronto ]: rontoDef,
  [ quecto ]: quectoDef
} ) as const satisfies PrefixMap;
