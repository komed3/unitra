import type { ConstantRef } from '../def/constant';
import type { PrefixRef } from '../def/prefix';
import type { UnitRef } from '../def/unit';

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

export type NodeMap = {
  unit: UnitNode;
  constant: ConstantNode;
  factor: FactorNode;
};

export type SerializedNode = {
  order: number;
  value: string;
};

export type SerializerMap = {
  [ K in keyof NodeMap ]: ( node: NodeMap[ K ] ) => SerializedNode;
};
