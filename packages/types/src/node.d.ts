import type { PrefixRef } from './prefix';
import type { UnitRef } from './unit';

export type UnitNode = {
  type: 'unit';
  unit: UnitRef;
  exp: number;
  prefix?: PrefixRef;
};

export type ConstantNode = {
  type: 'constant';
  exp: number;
};

export type FactorNode = {
  type: 'factor';
  value: number;
};

export type Node =
  | UnitNode
  | ConstantNode
  | FactorNode;

export type Nodes = ReadonlyArray< Node >;

export type ReferenceState = {
  nodes: Nodes;
};
