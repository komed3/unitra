export interface IAssert< Ref, Def > {
  isRef: ( value: unknown ) => value is Ref;
  isDef: ( value: unknown ) => value is Def;
  assertRef: ( value: unknown ) => asserts value is Ref;
  assertDef: ( value: unknown ) => asserts value is Def;
}

export interface IAssertService {}

export type ServicesContext = {
  services: {};
};
