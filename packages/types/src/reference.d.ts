export type UnitReferenceNode = {
  type: 'unit';
  exp: number;
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
