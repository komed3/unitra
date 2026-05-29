import type { ConstantRef } from './constant';
import type { PrefixRef } from './prefix';
import type { UnitRef } from './unit';

export type UnitNode = {
  readonly type: 'unit';
  unit: UnitRef;
  exp: number;
  prefix?: PrefixRef;
};

export type ConstantNode = {
  readonly type: 'constant';
  constant: ConstantRef;
  exp: number;
};

export type FactorNode = {
  readonly type: 'factor';
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
