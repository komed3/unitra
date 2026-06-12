import type { ConstantRef } from './def/constant';
import type { PrefixRef } from './def/prefix';
import type { UnitRef } from './def/unit';

export type NodeType = 'unit' | 'constant' | 'factor';

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
  exp: number;
};

export type Node =
  | UnitNode
  | ConstantNode
  | FactorNode;

export type Nodes = ReadonlyArray< Node >;

export type ReferenceState = {
  nodes: Nodes;
};

export type NodeGroups = readonly [
  numerator: Node[],
  denominator: Node[]
];

export type NodeMap = {
  unit: UnitNode;
  constant: ConstantNode;
  factor: FactorNode;
};

export type SerializedNode = {
  order: number;
  value: string;
};

export type SerializeMap = {
  [ K in keyof NodeMap ]:
    ( node: NodeMap[ K ] ) => SerializedNode;
};

export type DeserializeMap = {
  [ K in keyof NodeMap ]:
    ( value: string ) => NodeMap[ K ];
};

export type SerializedState = string & {
  readonly serializedState: unique symbol;
};
