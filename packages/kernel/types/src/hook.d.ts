export type HookHandler< C extends {}, I = void, O = void > = ( ctx: C, input?: I ) => O;

export type HookDefinition< C extends {}, I = void, O = void > = {
  handler: HookHandler< C, I, O >;
  priority?: number;
};

export type HookDefMap = {
  readonly [ K in string ]?: object;
};

export type HookImplMap = {
  readonly [ K in string ]?: ReadonlyArray< HookDefinition >;
};
