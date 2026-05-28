import type { PrefixRef } from './prefix';
import type { UnitRef } from './unit';

export type UnitReferenceNode = {
  type: 'unit';
  unit: UnitRef;
  exp: number;
  prefix?: PrefixRef;
};

export type ConstantReferenceNode = {
  type: 'constant';
  exp: number;
};

export type FactorReferenceNode = {
  type: 'factor';
  value: number;
};

export type ReferenceNode =
  | UnitReferenceNode
  | ConstantReferenceNode
  | FactorReferenceNode;

export type ReferenceNodes = ReadonlyArray< ReferenceNode >;

export type ReferenceState = {
  nodes: ReferenceNodes;
};
